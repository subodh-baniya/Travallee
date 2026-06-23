import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS must be first, before everything else
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:3000,",
    ].filter(Boolean) as string[];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization", "x-session-id"],
  exposedHeaders: ["Authorization"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
}));


app.use(express.json({ type: "application/json", limit: "10mb", strict: true }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

import hotelRoutes from "./routes/hotel.routes.js";

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/v1/hotels", hotelRoutes);

export default app;