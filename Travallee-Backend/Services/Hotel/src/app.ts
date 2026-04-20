import express from "express";
import cors from "cors";
import hotelRoutes from "./routes/hotel.routes.js";

const app = express();

app.use(cors());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));

//routes
app.use("/api/v1/hotels", hotelRoutes);



export default app; 