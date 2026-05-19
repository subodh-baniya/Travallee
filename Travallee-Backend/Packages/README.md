# 📦 Backend Packages - Shared Utilities

A centralized **shared utilities module** that provides common code, middleware, models, and utilities used by all backend microservices. This ensures consistency and reduces code duplication across services.

## 📋 Overview

The Packages module contains:
- **Middleware** - Shared Express middleware (auth, error handling, logging)
- **Models** - Database models and schemas
- **Utils** - Helper functions and utilities
- **Type Definitions** - Shared TypeScript types

This package is imported by all microservices to maintain consistency and enable code reuse.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript 5.9 |
| **Runtime** | Node.js 18+ |
| **ORM** | Mongoose 9.2 |
| **Authentication** | jsonwebtoken, bcrypt |
| **Validation** | Zod |
| **Caching** | ioredis |
| **Build** | TypeScript compiler |

---

## 📂 Project Structure

```
Packages/
├── index.ts                    # Main export file
├── package.json                # Package dependencies
├── tsconfig.json               # TypeScript configuration
│
├── middleware/                 # Shared middleware
│   ├── auth.middleware.ts      # JWT verification
│   ├── error.middleware.ts     # Global error handling
│   ├── cors.middleware.ts      # CORS configuration
│   ├── logger.middleware.ts    # Request logging
│   ├── rateLimit.middleware.ts # Rate limiting
│   └── validation.middleware.ts # Input validation
│
├── Model/                      # Database models
│   ├── User.ts                 # User model
│   ├── Hotel.ts                # Hotel model
│   ├── Booking.ts              # Booking model
│   ├── Room.ts                 # Room model
│   ├── Payment.ts              # Payment model
│   ├── Notification.ts         # Notification model
│   └── index.ts                # Models export
│
├── Utils/                      # Utility functions
│   ├── database.ts             # Database connection
│   ├── cache.ts                # Redis caching
│   ├── token.ts                # JWT utilities
│   ├── password.ts             # Password hashing
│   ├── validation.ts           # Data validation
│   ├── error.ts                # Error handling
│   ├── file-upload.ts          # File upload utilities
│   ├── mailer.ts               # Email sending
│   ├── logger.ts               # Logging utility
│   └── index.ts                # Utils export
│
├── types/                      # TypeScript type definitions
│   ├── express.d.ts            # Express request extensions
│   ├── index.ts                # Types export
│   └── ...
│
└── README.md                   # This file
```

---

## 🔧 Middleware

### Authentication Middleware

**File:** `middleware/auth.middleware.ts`

Verifies JWT tokens in request headers and attaches user info to request object.

```typescript
import { authMiddleware } from '@packages';

app.use(authMiddleware);

app.get('/protected', (req, res) => {
  // req.user is available and verified
  res.json({ user: req.user });
});
```

**Features:**
- ✅ JWT token validation
- ✅ Token expiration checking
- ✅ User role verification
- ✅ Optional: Refresh token rotation

### Error Middleware

**File:** `middleware/error.middleware.ts`

Centralized error handling for all services.

```typescript
import { errorMiddleware } from '@packages';

// Use at the end of middleware chain
app.use(errorMiddleware);
```

**Features:**
- ✅ Catches uncaught errors
- ✅ Standardizes error responses
- ✅ Logs errors
- ✅ Returns appropriate HTTP status codes

### CORS Middleware

**File:** `middleware/cors.middleware.ts`

Configures CORS for frontend communication.

```typescript
import { corsMiddleware } from '@packages';

app.use(corsMiddleware);
```

**Configured Origins:**
- `http://localhost:5173` (Dev frontends)
- `http://localhost:3000` (Expo)
- Production domains

### Logger Middleware

**File:** `middleware/logger.middleware.ts`

Logs all incoming HTTP requests.

```typescript
import { loggerMiddleware } from '@packages';

app.use(loggerMiddleware);
```

**Logs:**
- Method and path
- Status code
- Response time
- User ID (if authenticated)

### Rate Limiting

**File:** `middleware/rateLimit.middleware.ts`

Prevents abuse by limiting requests per IP.

```typescript
import { rateLimitMiddleware } from '@packages';

app.use('/api/', rateLimitMiddleware);
```

**Configuration:**
- Default: 100 requests per 15 minutes
- Per-endpoint customization available

### Validation Middleware

**File:** `middleware/validation.middleware.ts`

Validates request data using Zod schemas.

```typescript
import { validateRequest } from '@packages';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

app.post('/register', validateRequest(userSchema), handler);
```

---

## 🗄️ Database Models

### User Model

**File:** `Model/User.ts`

```typescript
import { User } from '@packages';

const user = await User.create({
  email: 'user@example.com',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'guest'
});
```

**Fields:**
- `_id` - MongoDB ObjectId
- `email` - User email (unique)
- `password` - Hashed password
- `firstName`, `lastName` - Name
- `phone` - Phone number
- `role` - 'guest', 'hotel_admin', 'super_admin'
- `isVerified` - Email verification status
- `createdAt`, `updatedAt` - Timestamps

### Hotel Model

**File:** `Model/Hotel.ts`

```typescript
const hotel = await Hotel.create({
  name: 'Grand Hotel',
  email: 'contact@hotel.com',
  location: 'New York',
  // ... other fields
});
```

**Fields:**
- `_id` - MongoDB ObjectId
- `name` - Hotel name
- `email` - Hotel email
- `phone` - Hotel phone
- `location` - Address/location
- `description` - Hotel description
- `amenities` - Array of amenities
- `rating` - Average rating
- `createdAt`, `updatedAt` - Timestamps

### Booking Model

**File:** `Model/Booking.ts`

```typescript
const booking = await Booking.create({
  userId: user._id,
  hotelId: hotel._id,
  roomId: room._id,
  checkInDate: new Date(),
  checkOutDate: new Date(),
  status: 'confirmed'
});
```

**Fields:**
- `_id` - MongoDB ObjectId
- `userId` - Guest user ID
- `hotelId` - Hotel ID
- `roomId` - Room ID
- `checkInDate` - Check-in date
- `checkOutDate` - Check-out date
- `status` - 'pending', 'confirmed', 'cancelled', 'completed'
- `totalPrice` - Total booking amount
- `createdAt`, `updatedAt` - Timestamps

### Room Model

**File:** `Model/Room.ts`

```typescript
const room = await Room.create({
  hotelId: hotel._id,
  type: 'deluxe',
  basePrice: 150,
  capacity: 2,
  amenities: ['wifi', 'ac', 'tv']
});
```

**Fields:**
- `_id` - MongoDB ObjectId
- `hotelId` - Parent hotel ID
- `type` - Room type (single, double, suite, etc.)
- `basePrice` - Nightly rate
- `capacity` - Number of guests
- `amenities` - Array of amenities
- `status` - 'available', 'occupied', 'maintenance'

### Payment Model

**File:** `Model/Payment.ts`

**Fields:**
- `_id` - MongoDB ObjectId
- `bookingId` - Associated booking
- `userId` - User who paid
- `amount` - Payment amount
- `currency` - Currency code
- `status` - 'pending', 'completed', 'failed', 'refunded'
- `transactionId` - Payment provider transaction ID

### Notification Model

**File:** `Model/Notification.ts`

**Fields:**
- `_id` - MongoDB ObjectId
- `userId` - Recipient user
- `type` - 'email', 'sms', 'push'
- `subject` - Notification subject
- `body` - Message content
- `status` - 'pending', 'sent', 'failed'

---

## 🛠️ Utility Functions

### Token Utils

**File:** `Utils/token.ts`

```typescript
import { generateToken, verifyToken } from '@packages';

// Generate JWT
const token = generateToken({ userId: user._id, role: user.role });

// Verify JWT
const decoded = verifyToken(token);
```

### Password Utils

**File:** `Utils/password.ts`

```typescript
import { hashPassword, comparePassword } from '@packages';

// Hash password
const hashedPwd = await hashPassword('plaintext_password');

// Compare passwords
const isMatch = await comparePassword('plaintext', hashedPwd);
```

### Validation Utils

**File:** `Utils/validation.ts`

```typescript
import { validateEmail, validatePhone, validateUrl } from '@packages';

validateEmail('user@example.com');  // true
validatePhone('+1234567890');       // true
validateUrl('https://example.com'); // true
```

### Cache Utils

**File:** `Utils/cache.ts`

```typescript
import { cache } from '@packages';

// Set cache
await cache.set('key', value, 3600); // 1 hour TTL

// Get cache
const value = await cache.get('key');

// Delete cache
await cache.del('key');
```

### File Upload Utils

**File:** `Utils/file-upload.ts`

```typescript
import { uploadToCloudinary, deleteFromCloudinary } from '@packages';

const url = await uploadToCloudinary(file);
await deleteFromCloudinary(publicId);
```

### Logger Utils

**File:** `Utils/logger.ts`

```typescript
import { logger } from '@packages';

logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message');
logger.debug('Debug message');
```

---

## 📤 Exports

Main export file [index.ts](index.ts) exports all utilities:

```typescript
// Middleware
export { authMiddleware, errorMiddleware, corsMiddleware, ... } from './middleware';

// Models
export { User, Hotel, Booking, Room, Payment, Notification } from './Model';

// Utils
export { generateToken, verifyToken, hashPassword, comparePassword, ... } from './Utils';

// Types
export type { IUser, IHotel, IBooking, ... } from './types';
```

### Usage in Services

```typescript
import {
  authMiddleware,
  User,
  generateToken,
  logger,
  validateEmail
} from '@packages';
```

---

## 🚀 Getting Started

### Installation

```bash
cd Travallee-Backend/Packages

npm install
```

### Building

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/` directory.

### Usage in Services

Link the package to services:

```bash
# From service directory
npm link ../Packages
```

Or use npm workspace feature in root `package.json`:

```json
{
  "workspaces": [
    "Packages",
    "Services/Auth",
    "Services/Hotel"
  ]
}
```

Then import from shared package:

```typescript
import { authMiddleware, User } from '@travallee/packages';
```

---

## 📦 Dependencies

```json
{
  "mongoose": "^9.2.0",
  "jsonwebtoken": "^9.1.0",
  "bcryptjs": "^2.4.3",
  "zod": "^3.23.0",
  "ioredis": "^5.3.0",
  "express": "^5.2.0",
  "typescript": "^5.9.0"
}
```

---

## 🔐 Security Best Practices

1. **Password Hashing** - Always use bcrypt for passwords
2. **Token Validation** - Validate JWT signatures
3. **Input Validation** - Use Zod for all inputs
4. **Error Logging** - Don't expose sensitive data in errors
5. **CORS Protection** - Limit origins appropriately
6. **Rate Limiting** - Prevent abuse
7. **Database Validation** - Mongoose schema validation

---

## 🧪 Testing

```bash
npm test
```

---

## 📚 Usage Example

Typical service setup using Packages:

```typescript
import express from 'express';
import { authMiddleware, errorMiddleware, corsMiddleware, logger } from '@packages';

const app = express();

// Apply shared middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(authMiddleware);

// Routes
app.get('/api/protected', (req, res) => {
  res.json({ user: req.user });
});

// Error handling
app.use(errorMiddleware);

app.listen(3000, () => {
  logger.info('Server running on port 3000');
});
```

---

## 📚 Related Documentation

- [Backend README](../README.md) - Backend overview
- [Root README](../../README.md) - Project overview
- [Architecture Guide](../../docs/ARCHITECTURE.md) - System design

---

## 🤝 Contributing

1. Keep code modular and reusable
2. Update exports in `index.ts`
3. Add TypeScript type definitions
4. Write tests for new utilities
5. Update this README for new features

---

## 📞 Support

- Review existing utilities before adding new ones
- Check TypeScript types for proper usage
- Ensure all services import from this package

---

**Shared Infrastructure of Travallee Backend**
