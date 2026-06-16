import express from 'express';
import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import cors from 'cors';
import { chatModel } from './model/chat.model.js';

const app = express();
const httpServer = new Server(app);

app.use(cors());
app.use(express.json());

// REST route to get chat message history
app.get("/api/v1/chat/history/:room", async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await chatModel.find({ room })
            .sort({ createdAt: 1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error: any) {
        console.error("Error retrieving chat history:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve chat history",
            error: error.message
        });
    }
});

const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const initsocket = async () => {
    const pubClient = createClient({ url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}` });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", (socket) => {
        console.log("a user connected: " + socket.id);

        socket.on("join_room", (room) => {
            socket.join(room);
            console.log("user " + socket.id + " joined room: " + room);
        });

        socket.on("leave_room", (room) => {
            socket.leave(room);
            console.log("user " + socket.id + " left room: " + room);
        });

        socket.on("send_message", async (data) => {
            console.log("message received in room " + data.room + ": " + data.message);
            try {
                // Save to MongoDB
                const savedMessage = await chatModel.create({
                    room: data.room,
                    sender: data.sender,
                    senderName: data.senderName,
                    message: data.message,
                    messageType: data.messageType || 'text',
                    attachmentUrl: data.attachmentUrl || null
                });
                // Emit saved message with fields like _id and createdAt populated
                io.to(data.room).emit("receive_message", savedMessage);
            } catch (dbErr) {
                console.error("Failed to save message to database:", dbErr);
                // Fallback to broadcasting the raw message so the chat UI stays functional
                io.to(data.room).emit("receive_message", {
                    ...data,
                    _id: `temp-${Date.now()}`,
                    createdAt: new Date().toISOString()
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("user disconnected: " + socket.id);
        });
    });

}

initsocket();

export default httpServer;