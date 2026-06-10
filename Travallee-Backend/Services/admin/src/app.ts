import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRoutes from './router/router.js';
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    path: "/api/v1/admin/socket.io",
    cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});



io.on("connection", (socket) => {
    const superAdminId = socket.handshake.query.SuperAdminId as string | undefined;
    if (!superAdminId) {
        try {
            // doesnt work must send query param for now, will fix later
            const authHeader = socket.handshake.headers.authorization;
            const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
            const authToken = (socket.handshake.auth as any)?.token as string | undefined;
            const token = authToken || bearerToken;

            if (!token) {
                console.log("Admin client connected without token:", socket.id);
                socket.disconnect();
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) 

        } catch (err) {
            console.log("Error during socket connection:", err);
            socket.disconnect();
            return;
        }
    }
    socket.join(`superadmin`);
    console.log("Admin client connected:", socket.id, "SuperAdminId:", superAdminId);
    socket.on("disconnect", () => {
        console.log("Admin client disconnected:", socket.id);
    });
});

app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/admin', adminRoutes);


export { io, server };