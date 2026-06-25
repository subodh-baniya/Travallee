import express from "express";
import cookieParser from "cookie-parser";
import "./queue/email.worker.js"; 


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});


export default app;