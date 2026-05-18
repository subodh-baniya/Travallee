import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin:  "http://localhost:5173",
    credentials: true
})); 
app.use(express.json({
    type: "application/json",    limit: "10mb",
    strict: true
}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));
app.use(cookieParser())

// @ts-ignore
import hotelRoutes from "./routes/hotel.routes";
app.use("/api/v1/hotels", hotelRoutes);



export default app; 