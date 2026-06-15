import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

import paymentRoutes from "./routes/payment.route";
app.use("/api/v1/payment",paymentRoutes);

export default app;