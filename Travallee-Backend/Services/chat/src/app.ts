import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import { authMiddleware } from './middleware/auth';
import { handleMessageEvents } from './events/messageHandler';
import { handleUserEvents } from './events/userHandler';

const app = express();
const httpServer = createServer(app);

// Redis clients for Socket.IO adapter
const pubClient = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

const subClient = pubClient.duplicate();

// Connect to Redis
(async () => {
  await pubClient.connect();
  await subClient.connect();
  console.log('Redis connected for chat service');
})();

// Socket.IO server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', process.env.ADMIN_FRONTEND_URL || 'http://localhost:3000'],
    credentials: true,
  },
  adapter: createAdapter(pubClient, subClient),
});

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', process.env.ADMIN_FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Chat service is running' });
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Missing authentication token'));
  }

  try {
    const decoded = authMiddleware(token);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (error) {
    return next(new Error('Invalid authentication token'));
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId} (${socket.id})`);

  // Message events
  handleMessageEvents(socket, io);

  // User events
  handleUserEvents(socket, io);

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId} (${socket.id})`);
    io.emit('user_offline', { userId: socket.userId });
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for user ${socket.userId}:`, error);
  });
});

export default { app, httpServer, io };
