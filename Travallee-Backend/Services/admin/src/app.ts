import express, { request } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRoutes from './router/router.js';
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // depends
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});



io.on("connection", (socket) => {
    const HotelId = socket.handshake.query.HotelId;
    if (!HotelId) {
        try {
            const token = request.headers.authorization?.split(" ")[1];
            if (!token) {
                console.log("Admin client connected without token:", socket.id);
                socket.disconnect();
                return;
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            if (!decoded) {
                console.log("Admin client connected with invalid token:", socket.id);
                socket.disconnect();
                return;
            }
            const { HotelId } = decoded as { HotelId: string };
            console.log("Admin client connected:", socket.id, "with HotelId:", HotelId);
            socket.join(`hotel_${HotelId}`);
            socket.on("disconnect", () => {
                console.log("Admin client disconnected:", socket.id);
            }
            )
        } catch (err) {
            console.log("Error during socket connection:", err);
            socket.disconnect();
        }


    }
    if (HotelId) {
        console.log("Admin client connected:", socket.id, "with HotelId:", HotelId);
        socket.join(`hotel_${HotelId}`);
        socket.on("disconnect", () => {
            console.log("Admin client disconnected:", socket.id);
        }
        )
    }
});

app.use(cors({
    origin: 'http://localhost:5173', // depends
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/admin', adminRoutes);


export { io, server };