
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
  "https://travallee-superadmin.netlify.app",
  "https://travallee-superadmin.onrender.com",
];

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));   
app.use(express.static("public"));
app.use(cookie());
app.use(passport.initialize());

// user routes
app.use("/api/v1/users", UserRouter);

export default app; 

