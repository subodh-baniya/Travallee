# 🔐 Auth Service

The **Authentication & Authorization Service** handles user registration, login, JWT token generation, OAuth integration, and role-based access control (RBAC). It's the gateway for all user authentication across the Travallee platform.

## 📋 Overview

Auth Service is responsible for:
- User registration (guests, hotel admins)
- User login with email/password
- JWT token generation and refresh
- OAuth authentication (Google)
- Email verification
- Password reset & recovery
- Role-based access control (RBAC)
- User profile management

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Express.js 5.2 |
| **Language** | TypeScript 5.9 |
| **Database** | MongoDB + Mongoose |
| **Caching** | Redis |
| **Authentication** | JWT, bcrypt 6.0 |
| **OAuth** | Passport.js (Google) |
| **Validation** | Zod |
| **Mail** | Resend API |

---

## 📂 Project Structure

```
Auth/
├── src/
│   ├── app.ts                  # Express app setup
│   ├── index.ts                # Server entry point
│   ├── Constants/              # Application constants
│   ├── Controllers/            # Request handlers
│   │   ├── auth.controller.ts  # Auth endpoints
│   │   └── user.controller.ts  # User endpoints
│   ├── Routes/                 # Route definitions
│   │   └── auth.routes.ts      # Auth routes
│   ├── Models/                 # Data models
│   │   └── User.ts             # User schema
│   ├── Services/               # Business logic
│   │   ├── auth.service.ts     # Auth logic
│   │   ├── user.service.ts     # User operations
│   │   └── token.service.ts    # Token management
│   ├── Middleware/             # Custom middleware
│   │   └── validate.middleware.ts
│   └── Utils/                  # Helpers
│       └── ...
│
├── .env.example                # Environment template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── Dockerfile                  # Docker configuration
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Redis

### Installation

```bash
cd Travallee-Backend/Services/Auth

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/travalee_auth

# Cache
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=30d

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Email Service
RESEND_API_KEY=re_your_api_key

# Frontend URLs
CLIENT_URL=http://localhost:5173
MOBILE_APP_URL=exp://localhost:8081
```

### Start Development Server

```bash
npm run dev
```

Server runs on: **http://localhost:3000**

### Build & Run Production

```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "guest" // "guest" or "hotel_admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "firstName": "John",
      "role": "guest"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

#### Google OAuth Login
```
GET /api/auth/google
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Verify Email
```
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token"
}
```

#### Request Password Reset
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "newPassword": "newSecurePassword123"
}
```

---

### User Management

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update User Profile
```
PATCH /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword"
}
```

---

## 📁 Controllers & Services

### Auth Controller

**File:** `src/Controllers/auth.controller.ts`

Handles all authentication requests:
- `register()` - New user registration
- `login()` - User login
- `logout()` - User logout
- `refreshToken()` - Refresh JWT
- `googleAuth()` - Google OAuth
- `verifyEmail()` - Email verification
- `forgotPassword()` - Password reset request
- `resetPassword()` - Password reset

### User Controller

**File:** `src/Controllers/user.controller.ts`

Manages user profile operations:
- `getCurrentUser()` - Get logged-in user
- `updateProfile()` - Update user info
- `changePassword()` - Change password
- `deleteAccount()` - Delete account

### Auth Service

**File:** `src/Services/auth.service.ts`

Business logic for authentication:
- User registration validation
- Email verification token generation
- Password reset token generation
- JWT token generation
- Token validation

### User Service

**File:** `src/Services/user.service.ts`

User management logic:
- Create user
- Find user by email/ID
- Update user profile
- Delete user
- Verify email
- Change password

### Token Service

**File:** `src/Services/token.service.ts`

JWT token operations:
- Generate access token
- Generate refresh token
- Verify token
- Decode token
- Refresh token rotation

---

## 🔐 Authentication Flow

### Registration Flow
```
1. User submits registration form
2. Validate email & password format
3. Check if email already exists
4. Hash password with bcrypt
5. Create user in database
6. Send verification email
7. Return JWT tokens
8. Frontend stores tokens
```

### Login Flow
```
1. User submits email/password
2. Find user by email
3. Compare password with hash
4. Generate JWT tokens
5. Set refresh token in Redis
6. Return tokens to frontend
7. Frontend includes token in subsequent requests
```

### Token Verification Flow
```
1. Extract token from Authorization header
2. Verify token signature with JWT_SECRET
3. Check if token expired
4. Extract user info from token
5. Attach user to request object
6. Proceed to next middleware
```

---

## 🔄 JWT Token Structure

### Access Token
```javascript
{
  "iat": 1234567890,
  "exp": 1234654290,  // 24 hours
  "userId": "60d5ec49c1234567890abcde",
  "email": "user@example.com",
  "role": "guest",
  "type": "access"
}
```

### Refresh Token
```javascript
{
  "iat": 1234567890,
  "exp": 1237246290,  // 30 days
  "userId": "60d5ec49c1234567890abcde",
  "type": "refresh"
}
```

---

## 📧 Email Templates

### Welcome Email
Sent after user registration with verification link.

### Email Verification
Verification email with token link.

### Password Reset
Password reset email with reset link (valid for 1 hour).

### Welcome After Verification
Confirmation email after email verification.

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (rounds: 12)
- ✅ JWT token expiration
- ✅ Refresh token rotation
- ✅ Email verification required
- ✅ Rate limiting on login attempts
- ✅ Account lockout after failed attempts
- ✅ HTTPS only in production
- ✅ CORS protection
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Mongoose)

---

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### Example Test
```typescript
describe('Auth Service', () => {
  it('should register a new user', async () => {
    const user = await authService.register({
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User'
    });
    expect(user.email).toBe('test@example.com');
  });
});
```

---

## 🐛 Error Handling

Common error responses:

```json
// Invalid credentials
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}

// Email already exists
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email already registered"
  }
}

// Token expired
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Token has expired. Please refresh."
  }
}
```

---

## 🚀 Deployment

### Docker Build
```bash
docker build -t travallee-auth:latest .
docker run -p 3000:3000 --env-file .env travallee-auth:latest
```

### Docker Compose
```bash
docker-compose up auth
```

### Environment for Production
```env
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
MONGODB_URI=<production-mongodb-uri>
REDIS_URL=<production-redis-url>
```

---

## 📚 Related Documentation

- [Backend README](../README.md) - Backend overview
- [Packages README](../../Packages/README.md) - Shared utilities
- [Root README](../../../README.md) - Project overview

---

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add tests for new features
3. Update API documentation
4. Follow existing code patterns
5. Commit: `git commit -am 'Add feature'`

---

## 📞 Support

- Check API error responses
- Review logs with `DEBUG=travallee:auth npm run dev`
- Verify environment variables
- Check MongoDB connection

---

**Authentication Service of Travallee**
