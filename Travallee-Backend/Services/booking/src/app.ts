import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({
    limit: '10mb' 
}));
app.use(urlencoded({extended:true}));
app.use(cookieParser())

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

import Bookingrouter from "./routes/booking.router.js"
app.use("/api/v1/booking",Bookingrouter)

export default app