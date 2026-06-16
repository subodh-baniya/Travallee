# Auth Service

The **Authentication and Authorization Service** handles user registration, login, JWT token generation, OAuth integration, and role-based access control (RBAC). It serves as the gateway for all user authentication across the Travallee platform.

## Overview

Auth Service is responsible for:

* User registration (guests and hotel administrators)
* User login with email and password
* JWT token generation and refresh
* OAuth authentication (Google)
* Email verification
* Password reset and recovery
* Role-based access control (RBAC)
* User profile management

---

## Tech Stack

| Component          | Technology           |
| ------------------ | -------------------- |
| **Framework**      | Express.js 5.2       |
| **Language**       | TypeScript 5.9       |
| **Database**       | MongoDB + Mongoose   |
| **Caching**        | Redis                |
| **Authentication** | JWT, bcrypt 6.0      |
| **OAuth**          | Passport.js (Google) |
| **Validation**     | Zod                  |
| **Mail Service**   | Resend API           |

---

## Project Structure

```text
Auth/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── Constants/
│   ├── Controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── Routes/
│   │   └── auth.routes.ts
│   ├── Models/
│   │   └── User.ts
│   ├── Services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── token.service.ts
│   ├── Middleware/
│   │   └── validate.middleware.ts
│   └── Utils/
│
├── .env.example
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js 18+
* MongoDB
* Redis

### Installation

```bash
cd Travallee-Backend/Services/Auth

npm install

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

Server runs on:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
```

#### Login

```http
POST /api/auth/login
```

#### Refresh Token

```http
POST /api/auth/refresh
```

#### Google OAuth Login

```http
GET /api/auth/google
```

#### Logout

```http
POST /api/auth/logout
```

#### Verify Email

```http
POST /api/auth/verify-email
```

#### Request Password Reset

```http
POST /api/auth/forgot-password
```

#### Reset Password

```http
POST /api/auth/reset-password
```

---

### User Management Endpoints

#### Get Current User

```http
GET /api/auth/me
```

#### Update User Profile

```http
PATCH /api/auth/profile
```

#### Change Password

```http
POST /api/auth/change-password
```

---

## Controllers and Services

### Auth Controller

**File:** `src/Controllers/auth.controller.ts`

Handles authentication requests:

* Register user
* Login user
* Logout user
* Refresh JWT tokens
* Google OAuth authentication
* Email verification
* Password reset requests

### User Controller

**File:** `src/Controllers/user.controller.ts`

Handles user operations:

* Retrieve current user
* Update profile
* Change password
* Delete account

### Auth Service

**File:** `src/Services/auth.service.ts`

Business logic for:

* User registration
* Authentication
* Password management
* Email verification
* Token generation

### User Service

**File:** `src/Services/user.service.ts`

Responsible for:

* User CRUD operations
* Email verification
* Password updates
* Profile management

### Token Service

**File:** `src/Services/token.service.ts`

Handles:

* Access token generation
* Refresh token generation
* Token validation
* Token decoding
* Refresh token rotation

---

## Authentication Flow

### Registration Flow

```text
1. User submits registration form
2. Validate email and password
3. Check existing account
4. Hash password using bcrypt
5. Create user record
6. Send verification email
7. Generate JWT tokens
8. Return response to frontend
```

### Login Flow

```text
1. User submits credentials
2. Verify email exists
3. Compare password hash
4. Generate JWT tokens
5. Store refresh token
6. Return authentication response
7. Frontend stores token
```

### Token Verification Flow

```text
1. Extract token from Authorization header
2. Verify JWT signature
3. Validate expiration
4. Extract user information
5. Attach user to request
6. Continue request processing
```

---

## JWT Token Structure

### Access Token

```javascript
{
  "iat": 1234567890,
  "exp": 1234654290,
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
  "exp": 1237246290,
  "userId": "60d5ec49c1234567890abcde",
  "type": "refresh"
}
```

---

## Email Templates

### Welcome Email

Sent after successful registration.

### Email Verification

Contains verification token and activation link.

### Password Reset

Contains password reset link valid for one hour.

### Verification Confirmation

Sent after successful email verification.

---

## Security Features

1. Password hashing with bcrypt (12 rounds)
2. JWT token expiration and validation
3. Refresh token rotation
4. Email verification requirement
5. Rate limiting on login attempts
6. Account lockout protection
7. HTTPS enforcement in production
8. CORS protection
9. Input validation using Zod
10. Injection attack prevention through Mongoose

---

## Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

---

## Error Handling

Common API error responses:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email already registered"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Token has expired. Please refresh."
  }
}
```

---

## Deployment

### Docker Build

```bash
docker build -t travallee-auth:latest .
docker run -p 3000:3000 --env-file .env travallee-auth:latest
```

### Docker Compose

```bash
docker-compose up auth
```

### Production Environment

```env
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
MONGODB_URI=<production-mongodb-uri>
REDIS_URL=<production-redis-url>
```

---

## Related Documentation

* Backend README
* Packages README
* Root README

---

## Contributing

1. Follow TypeScript best practices.
2. Add tests for new features.
3. Update API documentation when endpoints change.
4. Follow existing project conventions.
5. Write meaningful commit messages.

---

## Support

1. Review API error responses.
2. Check service logs.
3. Verify environment variables.
4. Confirm MongoDB and Redis connectivity.
5. Enable debugging when necessary.

```bash
DEBUG=travallee:auth npm run dev
```

---

**Authentication Service for the Travallee Hotel Management System**
