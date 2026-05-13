import express from 'express';
import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";


const app = express();

const httpServer = new Server(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

export default app;