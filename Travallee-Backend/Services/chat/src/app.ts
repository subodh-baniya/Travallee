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

  // Example of listening to a custom event from frontend
  socket.on("chat_message", (msg) => {
    console.log("Received message:", msg);
    // Broadcast the message to all connected clients
    io.emit("chat_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});




export default httpServer;