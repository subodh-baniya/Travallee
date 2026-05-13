import { Socket, Server as SocketIOServer } from 'socket.io';
import { chatModel } from '../models/Chat.model';

export const handleMessageEvents = (socket: Socket, io: SocketIOServer) => {
  // Join a room
  socket.on('join_room', (data: { roomId: string }) => {
    const { roomId } = data;
    socket.join(roomId);
    
    console.log(`User ${socket.userId} joined room ${roomId}`);
    
    // Notify others in the room
    io.to(roomId).emit('user_joined', {
      userId: socket.userId,
      message: `User ${socket.userId} joined the chat`,
      timestamp: new Date(),
    });
  });

  // Leave a room
  socket.on('leave_room', (data: { roomId: string }) => {
    const { roomId } = data;
    socket.leave(roomId);
    
    console.log(`User ${socket.userId} left room ${roomId}`);
    
    io.to(roomId).emit('user_left', {
      userId: socket.userId,
      message: `User ${socket.userId} left the chat`,
      timestamp: new Date(),
    });
  });

  // Send message
  socket.on('send_message', async (data: { roomId: string; message: string; senderName: string }) => {
    try {
      const { roomId, message, senderName } = data;

      if (!message.trim()) {
        socket.emit('error', { message: 'Message cannot be empty' });
        return;
      }

      // Save message to database
      const newMessage = await chatModel.create({
        room: roomId,
        sender: socket.userId,
        senderName: senderName || socket.userId,
        message: message.trim(),
        messageType: 'text',
      });

      // Emit to all in room
      io.to(roomId).emit('receive_message', {
        _id: newMessage._id,
        room: roomId,
        sender: socket.userId,
        senderName: senderName || socket.userId,
        message: newMessage.message,
        messageType: 'text',
        createdAt: newMessage.createdAt,
        readBy: newMessage.readBy,
      });

      console.log(`Message sent in room ${roomId} by ${socket.userId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', (data: { roomId: string; senderName: string }) => {
    const { roomId, senderName } = data;
    
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      senderName: senderName || socket.userId,
    });
  });

  // Stop typing
  socket.on('stop_typing', (data: { roomId: string }) => {
    const { roomId } = data;
    
    socket.to(roomId).emit('user_stop_typing', {
      userId: socket.userId,
    });
  });

  // Mark message as read
  socket.on('mark_as_read', async (data: { roomId: string; messageIds: string[] }) => {
    try {
      const { roomId, messageIds } = data;

      await chatModel.updateMany(
        { _id: { $in: messageIds }, room: roomId },
        { $push: { readBy: { userId: socket.userId, readAt: new Date() } } },
        { multi: true }
      );

      io.to(roomId).emit('message_read', {
        userId: socket.userId,
        messageIds: messageIds,
      });

      console.log(`Messages marked as read by ${socket.userId} in room ${roomId}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      socket.emit('error', { message: 'Failed to mark messages as read' });
    }
  });

  // Get chat history
  socket.on('get_history', async (data: { roomId: string; limit?: number; skip?: number }) => {
    try {
      const { roomId, limit = 50, skip = 0 } = data;

      const messages = await chatModel
        .find({ room: roomId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      socket.emit('chat_history', {
        roomId: roomId,
        messages: messages.reverse(),
      });

      console.log(`Chat history retrieved for room ${roomId} (${messages.length} messages)`);
    } catch (error) {
      console.error('Error retrieving chat history:', error);
      socket.emit('error', { message: 'Failed to retrieve chat history' });
    }
  });

  // Delete message
  socket.on('delete_message', async (data: { messageId: string; roomId: string }) => {
    try {
      const { messageId, roomId } = data;

      const message = await chatModel.findById(messageId);

      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      // Only allow sender to delete their own message
      if (message.sender.toString() !== socket.userId) {
        socket.emit('error', { message: 'You can only delete your own messages' });
        return;
      }

      await chatModel.deleteOne({ _id: messageId });

      io.to(roomId).emit('message_deleted', {
        messageId: messageId,
      });

      console.log(`Message ${messageId} deleted by ${socket.userId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      socket.emit('error', { message: 'Failed to delete message' });
    }
  });

  // Edit message
  socket.on('edit_message', async (data: { messageId: string; roomId: string; newMessage: string }) => {
    try {
      const { messageId, roomId, newMessage } = data;

      if (!newMessage.trim()) {
        socket.emit('error', { message: 'Message cannot be empty' });
        return;
      }

      const message = await chatModel.findById(messageId);

      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      // Only allow sender to edit their own message
      if (message.sender.toString() !== socket.userId) {
        socket.emit('error', { message: 'You can only edit your own messages' });
        return;
      }

      message.message = newMessage.trim();
      message.isEdited = true;
      message.editedAt = new Date();
      await message.save();

      io.to(roomId).emit('message_edited', {
        messageId: messageId,
        newMessage: newMessage.trim(),
        isEdited: true,
        editedAt: message.editedAt,
      });

      console.log(`Message ${messageId} edited by ${socket.userId}`);
    } catch (error) {
      console.error('Error editing message:', error);
      socket.emit('error', { message: 'Failed to edit message' });
    }
  });
};
