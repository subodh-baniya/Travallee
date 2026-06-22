# Chat Service

The **Chat Service** provides **real-time messaging capabilities using Socket.IO and Redis for scalable, bidirectional communication. It supports room-based chat, message persistence, user presence tracking, typing indicators, and message management.

## Overview

The Chat Service is responsible for:

* Real-time messaging
* Room-based communication
* Message persistence
* User presence tracking
* Typing indicators
* Message editing and deletion
* Read receipts
* Horizontal scaling with Redis

---

## Features

### Real-Time Messaging

* WebSocket-based communication using Socket.IO
* Instant message delivery
* Low-latency user interactions

### Room-Based Chat

* Join and leave chat rooms
* Multi-user communication
* Isolated room conversations

### User Presence

* Online and offline status tracking
* Active user monitoring
* Room participant management

### Message Management

* Create messages
* Edit existing messages
* Delete messages
* Read receipt tracking

### Scalability

* Redis adapter for distributed deployments
* Pub/Sub synchronization across multiple instances
* High availability architecture

---

## Technology Stack

| Component             | Technology |
| --------------------- | ---------- |
| **Framework**         | Node.js    |
| **WebSocket Library** | Socket.IO  |
| **Database**          | MongoDB    |
| **Caching / Pub-Sub** | Redis      |
| **Authentication**    | JWT        |
| **Language**          | TypeScript |

---

## Environment Variables

```env
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

---

## Socket Events

### Message Events

#### Join Room

```javascript
socket.emit('join_room', {
  roomId: 'room-123'
});
```

#### Send Message

```javascript
socket.emit('send_message', {
  roomId: 'room-123',
  message: 'Hello!',
  senderName: 'User Name'
});
```

#### Receive Message

```javascript
socket.on('receive_message', (message) => {
  console.log(message);
});
```

#### Typing Indicator

```javascript
socket.emit('typing', {
  roomId: 'room-123',
  senderName: 'User Name'
});
```

#### Delete Message

```javascript
socket.emit('delete_message', {
  messageId: 'msg-123',
  roomId: 'room-123'
});
```

#### Edit Message

```javascript
socket.emit('edit_message', {
  messageId: 'msg-123',
  roomId: 'room-123',
  newMessage: 'Updated message'
});
```

#### Get Chat History

```javascript
socket.emit('get_history', {
  roomId: 'room-123',
  limit: 50,
  skip: 0
});
```

#### Mark Messages as Read

```javascript
socket.emit('mark_as_read', {
  roomId: 'room-123',
  messageIds: ['msg-1', 'msg-2']
});
```

### User Events

| Event             | Description                            |
| ----------------- | -------------------------------------- |
| `user_online`     | Notify users when someone comes online |
| `user_offline`    | Notify users when someone goes offline |
| `get_room_users`  | Retrieve active users in a room        |
| `get_user_status` | Retrieve a user's online status        |

---

## System Architecture

```text
Socket.IO Server (Port 6001)
├── Redis Adapter
│   └── Pub/Sub Across Instances
├── MongoDB
│   └── Message Storage
├── JWT Authentication
└── Event Handlers
    ├── Message Handler
    └── User Handler
```

---

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

The service runs on:

```text
http://localhost:6001
```

---

## Frontend Integration

### React Example

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:6001', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

// Join room
socket.emit('join_room', {
  roomId: 'hotel-123'
});

// Send message
const sendMessage = (message: string) => {
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
socket.emit('typing', {
  roomId: 'hotel-123',
  senderName: 'User Name'
});

socket.on('user_typing', (data) => {
  console.log(`${data.senderName} is typing...`);
});
```

---

## Database Schema

### Chat Collection

```typescript
{
  _id: ObjectId,
  room: String,
  sender: ObjectId,
  senderName: String,
  message: String,
  messageType: String,
  attachmentUrl: String,
  readBy: [
    {
      userId: ObjectId,
      readAt: Date
    }
  ],
  isEdited: Boolean,
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Schema Fields

| Field         | Description                      |
| ------------- | -------------------------------- |
| room          | Chat room identifier             |
| sender        | User identifier                  |
| senderName    | Display name                     |
| message       | Message content                  |
| messageType   | Message type (text, image, file) |
| attachmentUrl | File or image URL                |
| readBy        | Read receipt information         |
| isEdited      | Indicates if message was edited  |
| editedAt      | Timestamp of edit                |

---

## Error Handling

All socket-related errors are emitted back to the client.

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error.message);
});
```

### Common Errors

1. Missing authentication token
2. Invalid JWT token
3. Invalid message content
4. Unauthorized message edit
5. Unauthorized message deletion
6. Invalid room identifier

---

## Performance Considerations

### Redis Adapter

* Enables horizontal scaling
* Synchronizes events across instances
* Supports distributed deployments

### Database Optimization

* Compound indexes on:

  * `room`
  * `createdAt`
* Efficient message retrieval
* Improved query performance

### Connection Management

* Database connection pooling
* Socket connection reuse
* Reduced resource consumption

### Cross-Origin Support

* Configurable CORS settings
* Multiple frontend support
* Secure origin validation

---

## Troubleshooting

### Connection Issues

1. Verify JWT token validity.
2. Check CORS configuration.
3. Ensure Redis is running and accessible.
4. Verify network connectivity.

### Messages Not Sending

1. Confirm the room ID is correct.
2. Ensure the message is not empty.
3. Verify the socket connection is active.
4. Check authentication status.

### Slow Chat History Retrieval

1. Verify database indexes exist.
2. Check database performance.
3. Monitor network latency.
4. Use pagination for large conversations.

---

## Future Enhancements

* File uploads and image sharing
* Voice and video call integration
* Message reactions
* Channel moderation tools
* Full-text message search
* End-to-end message encryption

---

## Development Guidelines

1. Follow TypeScript best practices.
2. Keep event handlers modular.
3. Validate all incoming socket events.
4. Implement proper error handling.
5. Maintain backward compatibility for socket events.
6. Document new events and payload structures.

---

## Support

For issues and troubleshooting:

1. Review application logs.
2. Verify Redis connectivity.
3. Verify MongoDB connectivity.
4. Confirm environment variable configuration.
5. Check frontend socket connection settings.

---

**Real-Time Chat Service for the Travallee Hotel Management System**
