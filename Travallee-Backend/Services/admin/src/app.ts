import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';   
import adminRoutes from './router/router.js';

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



app.use('/api/v1/admin', adminRoutes);


export default app;