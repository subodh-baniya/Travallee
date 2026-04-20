import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';   

const app = express();

app.use(express.json({
    limit: '10mb' 
}));
app.use(cors({
    origin: 'http://localhost:5173', // depends
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Define your routes here


export default app;