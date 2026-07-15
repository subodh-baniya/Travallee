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

// REST route to get active chat threads for a hotel
app.get("/api/v1/chat/threads/:hotelId", async (req, res) => {
    try {
        const { hotelId } = req.params;
        const threads = await chatModel.aggregate([
            {
                $match: {
                    room: { $regex: `^chat_${hotelId}_` }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$room",
                    latestMessage: { $first: "$message" },
                    time: { $first: "$createdAt" },
                    roomName: { $first: "$room" },
                    senderIdStr: { $first: { $toString: "$sender" } },
                    senderName: { $first: "$senderName" }
                }
            },
            {
                $project: {
                    _id: 0,
                    roomName: 1,
                    latestMessage: 1,
                    time: 1,
                    guestId: { $arrayElemAt: [{ $split: ["$roomName", "_"] }, 2] },
                    guestName: {
                        $cond: {
                            if: { $ne: ["$senderIdStr", hotelId] },
                            then: "$senderName",
                            else: "Guest"
                        }
                    }
                }
            },
            {
                $sort: { time: -1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: threads
        });
    } catch (error: any) {
        console.error("Error retrieving chat threads:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve chat threads",
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
    const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
    const pubClient = createClient({ url: redisUrl });
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

                // Also emit to hotel admin's broadcast room so they see new messages without opening the chat
                const roomParts = data.room.split('_');
                if (roomParts.length === 3 && roomParts[0] === 'chat') {
                    const hotelId = roomParts[1];
                    // Prevent duplicate if admin is already in the specific chat room?
                    // Frontend handles deduplication.
                    io.to(`hotel_${hotelId}`).emit("receive_message", savedMessage);
                }
            } catch (dbErr) {
                console.error("Failed to save message to database:", dbErr);
                const tempMsg = {
                    ...data,
                    _id: `temp-${Date.now()}`,
                    createdAt: new Date().toISOString()
                };
                // Fallback to broadcasting the raw message so the chat UI stays functional
                io.to(data.room).emit("receive_message", tempMsg);
                
                const roomParts = data.room.split('_');
                if (roomParts.length === 3 && roomParts[0] === 'chat') {
                    const hotelId = roomParts[1];
                    io.to(`hotel_${hotelId}`).emit("receive_message", tempMsg);
                }
            }
        });

        socket.on("disconnect", () => {
            console.log("user disconnected: " + socket.id);
        });
    });

}

initsocket();

export default httpServer;