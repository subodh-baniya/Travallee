import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 6001;

const connectDB = async (uri: string, dbName: string) => {
  try {
    await mongoose.connect(uri, {
      dbName: dbName,
    });
    console.log('MongoDB connected for chat service');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI!, process.env.MONGO_DB_NAME!);
    
    app.httpServer.listen(PORT, () => {
      console.log(`Chat service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start chat service:', error);
    process.exit(1);
  }
};

startServer();
