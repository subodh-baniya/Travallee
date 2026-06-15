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

export default app;