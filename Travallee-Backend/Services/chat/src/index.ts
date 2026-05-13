import dotenv from 'dotenv';

import {
connectDB //@ts-ignore
} from "@packages"

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 6001;


const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI, process.env.MONGO_DB_NAME);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

startServer();
