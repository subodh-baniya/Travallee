# 📚 Travallee Documentation Index

Complete documentation for the Travallee Hotel Management System codebase. Use this index to navigate all README files and project documentation.

---

## 🎯 Quick Navigation

### 📖 Start Here
- **[Main Project README](../README.md)** - Project overview, features, getting started
- **[Setup Guide](./SETUP.md)** - Installation and configuration instructions
- **[Architecture Guide](./ARCHITECTURE.md)** - System design and architecture

---

## 🏗️ Project Structure Documentation

### Frontend Applications

#### 🏢 Superadmin Dashboard
- **Location:** `Superadmin/`
- **Purpose:** Admin dashboard for system management
- **Documentation:** [Superadmin README](../Superadmin/README.md)
- **Tech Stack:** React 18, TypeScript, Tailwind CSS, Vite
- **Key Features:**
  - User management
  - Analytics dashboard
  - Hotel management
  - Settings and configuration

#### 🌐 User Frontend - Hotel Booking Website
- **Location:** `User-Frontend/`
- **Purpose:** Public-facing hotel booking website
- **Documentation:** [User Frontend README](../User-Frontend/README.md)
- **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS
- **Key Features:**
  - Hotel discovery and search
  - Room browsing
  - Booking management
  - Payment processing
  - User dashboard

#### 📱 Mobile App
- **Location:** `Travallee-App/`
- **Purpose:** Mobile application for guests
- **Documentation:** [Mobile App README](../Travallee-App/README.md)
- **Tech Stack:** React Native, Expo, TypeScript
- **Key Features:**
  - Hotel search
  - Booking creation
  - Booking management
  - Push notifications
  - Real-time messaging

---

### Backend Services

#### 🔧 Backend Infrastructure
- **Location:** `Travallee-Backend/`
- **Purpose:** Microservices backend architecture
- **Documentation:** [Backend README](../Travallee-Backend/README.md)
- **Architecture:** Docker, microservices, REST APIs
- **Database:** MongoDB, Redis

#### 📦 Shared Packages
- **Location:** `Travallee-Backend/Packages/`
- **Purpose:** Shared utilities, middleware, models
- **Documentation:** [Packages README](../Travallee-Backend/Packages/README.md)
- **Contents:**
  - Middleware (auth, error handling, logging)
  - Database models
  - Utility functions
  - Type definitions

---

### Backend Microservices

| Service | Port | Documentation | Purpose |
|---------|------|-----------------|---------|
| **Auth Service** | 3000 | [README](../Travallee-Backend/Services/Auth/README.md) | User authentication, JWT, OAuth |
| **Hotel Service** | 3001 | [README](../Travallee-Backend/Services/Hotel/README.md) | Hotel/room management, pricing |
| **Booking Service** | 5002 | [README](../Travallee-Backend/Services/booking/README.md) | Reservation management |
| **Admin Service** | 4001 | [README](../Travallee-Backend/Services/admin/README.md) | Analytics, user management |
| **Notifications** | 6000 | [README](../Travallee-Backend/Services/notifications/README.md) | Email, SMS, push notifications |
| **Chat Service** | 7000 | [README](../Travallee-Backend/Services/chat/README.md) | Real-time messaging |
| **Payment Service** | 3002 | [README](../Travallee-Backend/Services/payments/README.md) | Payment processing, invoicing |

---

## 📖 Documentation by Topic

### Getting Started
1. Read [Main README](../README.md) for project overview
2. Follow [Setup Guide](./SETUP.md) for installation
3. Review [Architecture](./ARCHITECTURE.md) for system design
4. Check [API Documentation](./API.md) for endpoint details

### For Frontend Developers
1. [Superadmin Dashboard README](../Superadmin/README.md) - Admin interface
2. [User Frontend README](../User-Frontend/README.md) - Public website
3. [Mobile App README](../Travallee-App/README.md) - React Native app
4. Frontend troubleshooting in each README

### For Backend Developers
1. [Backend README](../Travallee-Backend/README.md) - Backend overview
2. [Packages README](../Travallee-Backend/Packages/README.md) - Shared code
3. Individual service READMEs for specific services
4. [API Documentation](./API.md) - REST API endpoints

### For DevOps/Deployment
1. [Docker Setup](./DOCKER.md) - Containerization guide
2. [Deployment Guide](./DEPLOYMENT.md) - Production setup
3. Docker Compose configuration at root level

### For Database Management
1. [Database Schema](./DATABASE.md) - MongoDB collections
2. Individual service documentation for service-specific models
3. Packages Model documentation

---

## 🔌 API Documentation

### Service Endpoints Quick Reference

#### Authentication
- Auth Service: `http://localhost:3000/api/auth`
  - `/register` - User registration
  - `/login` - User login
  - `/logout` - User logout
  - `/refresh` - Refresh token
  - [Full Docs](../Travallee-Backend/Services/Auth/README.md#-api-endpoints)

#### Hotel Management
- Hotel Service: `http://localhost:3001/api`
  - `/hotels` - Hotel CRUD
  - `/rooms` - Room management
  - `/search` - Search hotels
  - [Full Docs](../Travallee-Backend/Services/Hotel/README.md#-api-endpoints)

#### Bookings
- Booking Service: `http://localhost:5002/api/bookings`
  - `/create` - Create booking
  - `/` - List bookings
  - `/availability` - Check availability
  - [Full Docs](../Travallee-Backend/Services/booking/README.md#-api-endpoints)

#### Admin
- Admin Service: `http://localhost:4001/api/admin`
  - `/users` - User management
  - `/analytics` - Analytics data
  - `/settings` - System configuration
  - [Full Docs](../Travallee-Backend/Services/admin/README.md#-api-endpoints)

#### Notifications
- Notifications Service: `http://localhost:6000/api/notifications`
  - `/send` - Send notification
  - `/preferences` - User preferences
  - [Full Docs](../Travallee-Backend/Services/notifications/README.md#-api-endpoints)

#### Chat
- Chat Service: `http://localhost:7000`
  - WebSocket: `socket.io` events
  - REST: `/api/chat/messages` - Message history
  - [Full Docs](../Travallee-Backend/Services/chat/README.md#-api-endpoints)

#### Payments
- Payment Service: `http://localhost:3002/api/payments`
  - `/create` - Create payment
  - `/invoices` - Invoice management
  - `/refunds` - Refund management
  - [Full Docs](../Travallee-Backend/Services/payments/README.md#-api-endpoints)

---

## 🛠️ Development Guides

### Local Development Setup
1. Prerequisites: Node.js 18+, Docker, MongoDB, Redis
2. Clone repository
3. Install dependencies for each project
4. Create `.env` files from `.env.example`
5. Start Docker services: `docker-compose up -d`
6. Start frontend dev servers
7. Start backend services
[Detailed Setup](./SETUP.md)

### Running Services Locally

#### Frontend Services
```bash
# Superadmin Dashboard
cd Superadmin && npm run dev   # http://localhost:5173

# User Frontend
cd User-Frontend && npm run dev # http://localhost:5173

# Mobile App
cd Travallee-App && npm start   # Expo development
```

#### Backend Services
```bash
# With Docker
docker-compose up -d            # All services

# Individual services
cd Travallee-Backend/Services/Auth && npm run dev   # :3000
cd Travallee-Backend/Services/Hotel && npm run dev  # :3001
# etc.
```

---

## 📊 Database Documentation

### MongoDB Collections
- Users
- Hotels
- Rooms
- Bookings
- Payments
- Notifications
- Messages
- AuditLogs

See [Database Schema Documentation](./DATABASE.md) for detailed schemas.

---

## 🔐 Security & Authentication

### JWT Flow
1. User logs in via Auth Service
2. JWT token generated
3. Token stored in frontend (localStorage/AsyncStorage)
4. Token included in API requests
5. Auth middleware validates token

See [Auth Service Documentation](../Travallee-Backend/Services/Auth/README.md) for details.

---

## 🧪 Testing

### Running Tests
```bash
# Frontend
cd Superadmin && npm test
cd User-Frontend && npm test
cd Travallee-App && npm test

# Backend
cd Travallee-Backend/Packages && npm test
cd Travallee-Backend/Services/Auth && npm test
# etc.
```

---

## 🚀 Deployment

### Quick Deployment
1. [Docker Setup](./DOCKER.md) - Build images
2. [Deployment Guide](./DEPLOYMENT.md) - Deploy services
3. Environment configuration
4. Database setup
5. Service orchestration

---

## 📁 File Organization

```
Travalee/
├── README.md                          # Main project README
├── docker-compose.yml                 # Docker orchestration
├── package.json                       # Root package config
│
├── docs/                              # Documentation
│   ├── ARCHITECTURE.md                # System design
│   ├── SETUP.md                       # Setup guide
│   ├── API.md                         # API documentation
│   ├── DATABASE.md                    # Database schema
│   ├── DEPLOYMENT.md                  # Deployment guide
│   └── INDEX.md (this file)           # Documentation index
│
├── Superadmin/                        # Admin dashboard
│   ├── README.md                      # Superadmin documentation
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│
├── User-Frontend/                     # Public website
│   ├── README.md                      # User frontend documentation
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│
├── Travallee-App/                     # Mobile app
│   ├── README.md                      # Mobile app documentation
│   ├── package.json
│   ├── app.config.js
│   └── src/
│
└── Travallee-Backend/                 # Backend services
    ├── README.md                      # Backend overview
    ├── Packages/                      # Shared utilities
    │   ├── README.md                  # Packages documentation
    │   ├── package.json
    │   ├── middleware/
    │   ├── Model/
    │   └── Utils/
    │
    └── Services/                      # Microservices
        ├── Auth/
        │   ├── README.md              # Auth service docs
        │   └── package.json
        ├── Hotel/
        │   ├── README.md              # Hotel service docs
        │   └── package.json
        ├── booking/
        │   ├── README.md              # Booking service docs
        │   └── package.json
        ├── admin/
        │   ├── README.md              # Admin service docs
        │   └── package.json
        ├── notifications/
        │   ├── README.md              # Notifications service docs
        │   └── package.json
        ├── chat/
        │   ├── README.md              # Chat service docs
        │   └── package.json
        └── payments/
            ├── README.md              # Payment service docs
            └── package.json
```

---

## 🔍 Finding Information

### I need to...

**Get started with the project**
→ Read [Main README](../README.md) then [Setup Guide](./SETUP.md)

**Understand the system architecture**
→ Read [Architecture Guide](./ARCHITECTURE.md)

**Develop the Superadmin Dashboard**
→ Read [Superadmin README](../Superadmin/README.md)

**Develop the public website**
→ Read [User Frontend README](../User-Frontend/README.md)

**Develop the mobile app**
→ Read [Mobile App README](../Travallee-App/README.md)

**Work on the backend**
→ Read [Backend README](../Travallee-Backend/README.md) then individual service READMEs

**Understand shared code**
→ Read [Packages README](../Travallee-Backend/Packages/README.md)

**Use specific API endpoints**
→ Check [API Documentation](./API.md) or individual service READMEs

**Deploy to production**
→ Read [Deployment Guide](./DEPLOYMENT.md)

**Debug authentication issues**
→ Read [Auth Service README](../Travallee-Backend/Services/Auth/README.md)

**Work with databases**
→ Read [Database Schema Documentation](./DATABASE.md)

---

## 🤝 Contributing

All documentation should:
- Follow the structure in individual README files
- Include API endpoints with examples
- Provide tech stack information
- Explain purpose and key features
- Include getting started instructions
- Link to related documentation

---

## 📞 Support

- Check relevant README files for your area of work
- Review [Setup Guide](./SETUP.md) for common issues
- Check [API Documentation](./API.md) for endpoint details
- Review [Architecture](./ARCHITECTURE.md) for system design
- Check individual service READMEs for service-specific help

---

**Last Updated:** May 2024
**Documentation Version:** 1.0
**Total Services:** 7 (Auth, Hotel, Booking, Admin, Notifications, Chat, Payments)
**Frontend Applications:** 3 (Superadmin, User Website, Mobile App)

