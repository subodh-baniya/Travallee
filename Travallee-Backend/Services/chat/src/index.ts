import dotenv from 'dotenv';
import httpServer from './app';
import {
  connectDB
} from "./config/Func/connect.db.js";


const PORT = process.env.PORT || 6001;



const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI as string, process.env.MONGO_DB_NAME as string);
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

startServer();
