import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';   
import adminRoutes from './router/router.js';
import { Server } from "socket.io";
import http from "http";

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
    const adminId = socket.handshake.query.HotelId;
    console.log("Admin client connected:", socket.id, "with HotelId:", adminId);
    socket.join(`hotel_${adminId}`); 
    socket.on("disconnect", () => {
        console.log("Admin client disconnected:", socket.id);
    });
});

app.use(cors({
    origin: 'http://localhost:5173', // depends
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/admin', adminRoutes);


export { io, server };