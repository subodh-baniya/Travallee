# Chat Service

Real-time chat service using Socket.IO with Redis adapter for scalability.

## Features

- **Real-time messaging** - WebSocket-based communication
- **Room-based chat** - Join/leave chat rooms
- **Message persistence** - Store messages in MongoDB
- **User presence** - Online/offline status
- **Typing indicators** - See when users are typing
- **Message management** - Edit and delete messages
- **Read receipts** - Track message read status
- **Redis adapter** - Horizontal scaling support

## Environment Variables

```
MONGO_URI=mongodb://db:27017
MONGO_DB_NAME=ghumgham
REDIS_HOST=redis
REDIS_PORT=6379
PORT=6001
NODE_ENV=development
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:5173
ADMIN_FRONTEND_URL=http://localhost:3000
```

## Socket Events

### Message Events

- **`join_room`** - Join a chat room
  ```javascript
  socket.emit('join_room', { roomId: 'room-123' });
  ```

- **`send_message`** - Send a message
  ```javascript
  socket.emit('send_message', {
    roomId: 'room-123',
    message: 'Hello!',
    senderName: 'User Name'
  });
  ```

- **`receive_message`** - Listen for incoming messages
  ```javascript
  socket.on('receive_message', (message) => {
    console.log(message);
  });
  ```

- **`typing`** - Notify others you're typing
  ```javascript
  socket.emit('typing', {
    roomId: 'room-123',
    senderName: 'User Name'
  });
  ```

- **`delete_message`** - Delete a message
  ```javascript
  socket.emit('delete_message', {
    messageId: 'msg-123',
    roomId: 'room-123'
  });
  ```

- **`edit_message`** - Edit a message
  ```javascript
  socket.emit('edit_message', {
    messageId: 'msg-123',
    roomId: 'room-123',
    newMessage: 'Updated message'
  });
  ```

- **`get_history`** - Get chat history
  ```javascript
  socket.emit('get_history', {
    roomId: 'room-123',
    limit: 50,
    skip: 0
  });
  ```

- **`mark_as_read`** - Mark messages as read
  ```javascript
  socket.emit('mark_as_read', {
    roomId: 'room-123',
    messageIds: ['msg-1', 'msg-2']
  });
  ```

### User Events

- **`user_online`** - Notify room user is online
- **`user_offline`** - Notify room user went offline
- **`get_room_users`** - Get list of users in room
- **`get_user_status`** - Get user's online status

## Architecture

```
Socket.IO Server (Port 6001)
├── Redis Adapter (for pub/sub across instances)
├── MongoDB (Message storage)
├── Authentication (JWT)
└── Event Handlers
    ├── Message Handler
    └── User Handler
```

## Starting the Service

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Integration with Frontend

### React Example

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:6001', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

// Join room
socket.emit('join_room', { roomId: 'hotel-123' });

// Send message
const sendMessage = (message) => {
  socket.emit('send_message', {
    roomId: 'hotel-123',
    message,
    senderName: 'User Name',
  });
};

// Receive messages
socket.on('receive_message', (message) => {
  console.log('New message:', message);
});

// Typing indicator
socket.emit('typing', { roomId: 'hotel-123', senderName: 'User Name' });

socket.on('user_typing', (data) => {
  console.log(`${data.senderName} is typing...`);
});
```

## Database Schema

### Chat Collection

```typescript
{
  _id: ObjectId,
  room: String,              // Chat room ID
  sender: ObjectId,          // Sender user ID
  senderName: String,        // Sender name for display
  message: String,           // Message content
  messageType: String,       // 'text' | 'image' | 'file'
  attachmentUrl: String,     // URL for attachments
  readBy: [{                 // Read receipts
    userId: ObjectId,
    readAt: Date
  }],
  isEdited: Boolean,
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All socket errors are emitted to the client:

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error.message);
});
```

Common errors:
- Missing authentication token
- Invalid JWT token
- Message content validation
- Unauthorized message edit/delete

## Performance Considerations

- **Redis Adapter** - Enables horizontal scaling across multiple instances
- **Message Indexing** - Compound indexes on `room` + `createdAt` for fast queries
- **Connection Pool** - Reuses database connections
- **CORS Configuration** - Supports multiple frontends

## Troubleshooting

### Connection Issues
- Verify JWT token is valid
- Check CORS settings match frontend URL
- Ensure Redis is running and accessible

### Message Not Sent
- Check room ID is correct
- Verify message is not empty
- Confirm user is connected to socket

### Slow Chat History
- Verify database indexes are created
- Check network latency
- Consider pagination with limit/skip parameters

## Future Enhancements

- [ ] File uploads and image sharing
- [ ] Voice/video call integration
- [ ] Message reactions/emojis
- [ ] Channel moderation
- [ ] Message search functionality
- [ ] Encryption for sensitive messages
