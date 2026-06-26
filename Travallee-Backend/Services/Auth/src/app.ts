
import express, { Router } from "express";
import cookie from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import passport from "passport";



import UserRouter from "./Router/user.router.js";
import "./services/passport.js"; 


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://travalee.vercel.app",
  "https://travallee-superadmin.onrender.com",
];

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.sendStatus(204);
  }
  next();
});
app.use(cors(corsOptions));

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));   
app.use(express.static("public"));
app.use(cookie());
app.use(passport.initialize());
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/cors-check", (req, res) => res.status(200).json({ v: "check" }));

// user routes
app.use("/api/v1/users", UserRouter);

export default app; 

