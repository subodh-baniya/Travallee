import express from 'express';
import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import {createClient} from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const app = express();
const httpServer = new Server(app);

const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const initsocket = async () => {
    const pubClient = createClient({url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`});
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", (socket) => {
        console.log("a user connected: " + socket.id);
        socket.on("join_room", (room) => {
            socket.join(room);
            console.log("user " + socket.id + " joined room: " + room);
        }
        );
        socket.on("leave_room", (room) => {
            socket.leave(room);
            console.log("user " + socket.id + " left room: " + room);
        }
        );
        socket.on("send_message", (data) => {
            console.log("message received: " + data.message + " from user: " + socket.id);
            io.to(data.room).emit("receive_message", data);
        }
        );
        socket.on("disconnect", () => {
            console.log("user disconnected: " + socket.id);
        });
    });

}

initsocket();



export default httpServer;