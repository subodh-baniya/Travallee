import dotenv from "dotenv"
import express from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import adminRoutes from './router/router.js';
import { Server } from "socket.io";
import http from "http"



dotenv.config({
    path:"./.env"
})



const app = express();

const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://travallee-superadmin.netlify.app",
    "https://travallee-superadmin.onrender.com",
];

const corsOptions:CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
};


const io = new Server(server, {
    path: "/api/v1/admin/socket.io",
    cors: corsOptions
});



io.on("connection", (socket) => {
    const hotelId = (socket.handshake.query.hotelId || socket.handshake.query.HotelId) as string | undefined;
    if (hotelId) {
        socket.join(`hotel_${hotelId}`);
    } else {
        socket.join("superadmin");
    }
    console.log("Admin client connected:", socket.id, "HotelId:", hotelId);
    socket.on("disconnect", () => {
        console.log("Admin client disconnected:", socket.id);
    });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/admin', adminRoutes);


export { io, server };