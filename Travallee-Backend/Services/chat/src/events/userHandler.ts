import { Socket, Server as SocketIOServer } from 'socket.io';

interface UserStatus {
  userId: string;
  isOnline: boolean;
  lastSeen?: Date;
}

// In-memory store for user status (can be extended to Redis)
const userStatus = new Map<string, UserStatus>();

export const handleUserEvents = (socket: Socket, io: SocketIOServer) => {
  // User comes online
  socket.on('user_online', (data: { roomId: string; userName: string }) => {
    const { roomId, userName } = data;

    // Update user status
    userStatus.set(socket.userId, {
      userId: socket.userId,
      isOnline: true,
    });

    console.log(`User ${socket.userId} is online in room ${roomId}`);

    // Broadcast to room
    io.to(roomId).emit('user_online', {
      userId: socket.userId,
      userName: userName || socket.userId,
      timestamp: new Date(),
    });
  });

  // User goes offline
  socket.on('user_offline', (data: { roomId: string }) => {
    const { roomId } = data;

    // Update user status
    const status = userStatus.get(socket.userId);
    if (status) {
      status.isOnline = false;
      status.lastSeen = new Date();
    }

    console.log(`User ${socket.userId} went offline in room ${roomId}`);

    // Broadcast to room
    io.to(roomId).emit('user_offline', {
      userId: socket.userId,
      lastSeen: new Date(),
      timestamp: new Date(),
    });
  });

  // Get online users in room
  socket.on('get_room_users', (data: { roomId: string }) => {
    const { roomId } = data;

    const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
    const usersInRoom: string[] = [];

    if (socketsInRoom) {
      socketsInRoom.forEach((socketId) => {
        const socketInstance = io.sockets.sockets.get(socketId);
        if (socketInstance?.userId && usersInRoom.indexOf(socketInstance.userId) === -1) {
          usersInRoom.push(socketInstance.userId);
        }
      });
    }

    socket.emit('room_users', {
      roomId: roomId,
      users: usersInRoom,
      count: usersInRoom.length,
    });

    console.log(`Room ${roomId} has ${usersInRoom.length} users`);
  });

  // Typing status
  socket.on('user_typing', (data: { roomId: string; userName: string }) => {
    const { roomId, userName } = data;

    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      userName: userName || socket.userId,
    });
  });

  // Stop typing
  socket.on('user_stop_typing', (data: { roomId: string }) => {
    const { roomId } = data;

    socket.to(roomId).emit('user_stop_typing', {
      userId: socket.userId,
    });
  });

  // Get user status
  socket.on('get_user_status', (data: { userId: string }) => {
    const { userId } = data;

    const status = userStatus.get(userId) || {
      userId: userId,
      isOnline: false,
    };

    socket.emit('user_status', status);
  });

  // Acknowledge connection
  socket.on('acknowledge', () => {
    socket.emit('acknowledged', {
      message: 'Connection established',
      userId: socket.userId,
    });
  });
};
