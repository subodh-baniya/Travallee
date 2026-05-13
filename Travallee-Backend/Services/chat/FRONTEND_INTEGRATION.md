/**
 * Example Chat Hook for React Frontend (HotelAdmin-Frontend)
 * Usage in components:
 * 
 * const ChatComponent = () => {
 *   const { socket, messages, sendMessage } = useChat('hotel-123');
 *   return (
 *     <div>
 *       {messages.map(msg => <div key={msg._id}>{msg.message}</div>)}
 *       <input onChange={e => sendMessage(e.target.value)} />
 *     </div>
 *   );
 * };
 */

import io, { Socket } from 'socket.io-client';
import { useEffect, useState, useCallback } from 'react';

interface ChatMessage {
  _id: string;
  room: string;
  sender: string;
  senderName: string;
  message: string;
  createdAt: Date;
  readBy: any[];
}

export const useChat = (roomId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:6001', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat service');
      setIsConnected(true);
      newSocket.emit('join_room', { roomId });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat service');
      setIsConnected(false);
    });

    newSocket.on('receive_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('chat_history', (data: { messages: ChatMessage[] }) => {
      setMessages(data.messages);
    });

    newSocket.on('user_typing', (data: { userId: string; senderName: string }) => {
      setTypingUsers((prev) => [...new Set([...prev, data.senderName])]);
    });

    newSocket.on('user_stop_typing', (data: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.userId));
    });

    newSocket.on('room_users', (data: { users: string[] }) => {
      setOnlineUsers(data.users);
    });

    newSocket.on('user_joined', (data: { userId: string }) => {
      console.log(`${data.userId} joined the room`);
    });

    newSocket.on('message_deleted', (data: { messageId: string }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
    });

    newSocket.on('error', (error: any) => {
      console.error('Socket error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave_room', { roomId });
      newSocket.close();
    };
  }, [roomId]);

  // Send message
  const sendMessage = useCallback(
    (message: string, senderName: string = 'Anonymous') => {
      if (socket && message.trim()) {
        socket.emit('send_message', { roomId, message, senderName });
      }
    },
    [socket, roomId]
  );

  // Typing indicator
  const notifyTyping = useCallback(
    (senderName: string = 'Anonymous') => {
      if (socket) {
        socket.emit('typing', { roomId, senderName });
      }
    },
    [socket, roomId]
  );

  // Stop typing
  const notifyStopTyping = useCallback(() => {
    if (socket) {
      socket.emit('stop_typing', { roomId });
    }
  }, [socket, roomId]);

  // Get chat history
  const loadHistory = useCallback(
    (limit: number = 50, skip: number = 0) => {
      if (socket) {
        socket.emit('get_history', { roomId, limit, skip });
      }
    },
    [socket, roomId]
  );

  // Get room users
  const getRoomUsers = useCallback(() => {
    if (socket) {
      socket.emit('get_room_users', { roomId });
    }
  }, [socket, roomId]);

  // Delete message
  const deleteMessage = useCallback(
    (messageId: string) => {
      if (socket) {
        socket.emit('delete_message', { messageId, roomId });
      }
    },
    [socket, roomId]
  );

  // Edit message
  const editMessage = useCallback(
    (messageId: string, newMessage: string) => {
      if (socket) {
        socket.emit('edit_message', { messageId, roomId, newMessage });
      }
    },
    [socket, roomId]
  );

  // Mark as read
  const markAsRead = useCallback(
    (messageIds: string[]) => {
      if (socket) {
        socket.emit('mark_as_read', { roomId, messageIds });
      }
    },
    [socket, roomId]
  );

  return {
    socket,
    messages,
    typingUsers,
    onlineUsers,
    isConnected,
    sendMessage,
    notifyTyping,
    notifyStopTyping,
    loadHistory,
    getRoomUsers,
    deleteMessage,
    editMessage,
    markAsRead,
  };
};

/**
 * Usage Example:
 * 
 * import { useChat } from './hooks/useChat';
 * 
 * export const ChatPage = () => {
 *   const { messages, sendMessage, typingUsers, onlineUsers } = useChat('hotel-admin-chat');
 *   const [input, setInput] = useState('');
 * 
 *   const handleSend = () => {
 *     sendMessage(input, 'Admin User');
 *     setInput('');
 *   };
 * 
 *   return (
 *     <div className="chat-container">
 *       <div className="messages">
 *         {messages.map(msg => (
 *           <div key={msg._id} className="message">
 *             <strong>{msg.senderName}:</strong> {msg.message}
 *           </div>
 *         ))}
 *         {typingUsers.length > 0 && (
 *           <div className="typing">{typingUsers.join(', ')} is typing...</div>
 *         )}
 *       </div>
 *       <div className="input-area">
 *         <input
 *           value={input}
 *           onChange={e => setInput(e.target.value)}
 *           placeholder="Type message..."
 *         />
 *         <button onClick={handleSend}>Send</button>
 *       </div>
 *       <div className="online-users">
 *         Online: {onlineUsers.join(', ')}
 *       </div>
 *     </div>
 *   );
 * };
 */
