#  Backend - Microservices Architecture

The backend is organized as a microservices architecture where each service runs independently and communicates via REST APIs. All services share common utilities and middleware through the Packages module.

##  Overview

The Travallee Backend consists of:

**Packages** - Shared utilities, middleware, models, and authentication logic
**Services** - Independent microservices for different business domains

Each service is containerized with Docker and orchestrated via Docker Compose.

---

##  Architecture

```
┌────────────────────────────────────────────────────┐
│         MICROSERVICES LAYER                        │
│  ┌───────┐ ┌────────┐ ┌────────┐ ┌─────────────┐ │
│  │Auth   │ │Hotel   │ │Booking │ │Admin/Chat   │ │
│  │:3000  │ │:3001   │ │:5002   │ │:4001+       │ │
│  └───────┘ └────────┘ └────────┘ └─────────────┘ │
│  ┌────────────────────────────────────────────────┤ │
│  │Shared Packages (Utilities, Models, Auth)      │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────┐
│       DATA LAYER (Databases & Cache)              │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ MongoDB          │  │ Redis Cache          │  │
│  │ (Primary DB)     │  │ (Sessions, Cache)    │  │
│  └──────────────────┘  └──────────────────────┘  │
└────────────────────────────────────────────────────┘
```

---

##  Directory Structure

```
Travallee-Backend/
├── Packages/                   # Shared code
│   ├── index.ts               # Main export
│   ├── package.json
│   ├── tsconfig.json
│   ├── middleware/            # Shared middleware
│   ├── Model/                 # Database models
│   ├── Utils/                 # Utility functions
│   └── README.md              # Packages documentation
│
└── Services/                  # Microservices
    ├── Auth/                  # Authentication service
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── src/
    │   │   ├── Controllers/
    │   │   ├── Routes/
    │   │   ├── Models/
    │   │   ├── Services/
    │   │   └── app.ts
    │   └── README.md
    │
    ├── Hotel/                 # Hotel & room management
    │   ├── src/
    │   │   ├── Controllers/
    │   │   ├── Routes/
    │   │   ├── Models/
    │   │   └── app.ts
    │   └── README.md
    │
    ├── booking/               # Booking management
    │   ├── src/
    │   └── README.md
    │
    ├── admin/                 # Admin operations
    │   ├── src/
    │   └── README.md
    │
    ├── chat/                  # Real-time messaging
    │   ├── src/
    │   └── README.md
    │
    ├── notifications/         # Email & push notifications
    │   ├── src/
    │   └── README.md
    │
    └── payments/              # Payment processing
        ├── src/
        └── README.md
```

---

##  Tech Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 5.2 |
| **Language** | TypeScript 5.9 |
| **Database** | MongoDB 7.2 |
| **Caching** | Redis 5.10 |
| **Container** | Docker & Docker Compose |
| **Authentication** | JWT, bcrypt 6.0 |
| **Validation** | Zod |
| **Job Queue** | BullMQ |
| **ORM/ODM** | Mongoose 9.2 |

---

##  Services Overview

### Auth Service (Port 3000)
- User registration and login
- JWT token generation
- OAuth integration (Google)
- Role-based access control (RBAC)
- Password hashing and validation

**Location:** [Services/Auth/](Services/Auth/)
**Docs:** [Auth Service README](Services/Auth/README.md)

### Hotel Service (Port 3001)
- Hotel management
- Room inventory
- Pricing management
- Hotel search and filtering
- Floor/wing management

**Location:** [Services/Hotel/](Services/Hotel/)
**Docs:** [Hotel Service README](Services/Hotel/README.md)

### Booking Service (Port 5002)
- Create and manage bookings
- Check-in/check-out management
- Availability checking
- Booking history
- Cancellation policies

**Location:** [Services/booking/](Services/booking/)
**Docs:** [Booking Service README](Services/booking/README.md)

### Admin Service (Port 4001)
- User management
- Analytics and reporting
- System configuration
- Audit logs
- Admin operations

**Location:** [Services/admin/](Services/admin/)
**Docs:** [Admin Service README](Services/admin/README.md)

### Notifications Service (Port 6000)
- Email notifications
- SMS messages
- Push notifications
- Notification templates
- Delivery tracking

**Location:** [Services/notifications/](Services/notifications/)
**Docs:** [Notifications Service README](Services/notifications/README.md)

### Chat Service
- Real-time messaging
- Guest-staff communication
- Message history
- Presence detection
- Typing indicators

**Location:** [Services/chat/](Services/chat/)
**Docs:** [Chat Service README](Services/chat/README.md)

### Payment Service
- Payment processing
- Invoice generation
- Refund management
- Payment history
- Reconciliation

**Location:** [Services/payments/](Services/payments/)
**Docs:** [Payment Service README](Services/payments/README.md)

---

##  Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose
- Git
- MongoDB 7.2+ (if running without Docker)
- Redis 5.10+ (if running without Docker)

### Quick Start with Docker

```bash
# Navigate to project root
cd Travalee

# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Setup (One Service)

```bash
# Navigate to backend
cd Travallee-Backend

# Install Packages dependencies
cd Packages && npm install && cd ..

# Install Auth Service
cd Services/Auth
npm install
cp .env.example .env

# Start service
npm run dev
```

---

##  Shared Packages

Located in [Packages/](Packages/), provides shared code for all services:

### Middleware
- Authentication middleware (JWT validation)
- Error handling middleware
- CORS configuration
- Rate limiting
- Request logging

### Models
- User model
- Hotel model
- Booking model
- Payment model
- Notification model

### Utils
- Database utilities
- Validation helpers
- Error handling
- Token generation
- File upload utilities

### Usage in Services

```typescript
// Import from shared Packages
import { authMiddleware, User, ValidationError } from '@packages';

app.use(authMiddleware);

app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
```

---

##  Inter-Service Communication

Services communicate via REST APIs:

```
Service A → Service B
  (HTTP Request)
    ↓
Service B → Response
  (JSON Data)
```

Example:
```typescript
// Booking Service calling Hotel Service
import axios from 'axios';

const hotelService = axios.create({
  baseURL: 'http://hotel:3001/api'
});

async function checkAvailability(roomId, dates) {
  const response = await hotelService.get(
    `/rooms/${roomId}/availability`,
    { params: { dates } }
  );
  return response.data;
}
```

---

##  Database & Caching

### MongoDB
- Primary database for all services
- Centralized data storage
- Collections per domain:
  - `users` - User accounts
  - `hotels` - Hotel information
  - `bookings` - Reservations
  - `payments` - Transactions
  - etc.

### Redis
- Session storage
- Cache layer
- Real-time data (online users)
- Job queue (BullMQ)
- Rate limiting

---

##  Authentication & Security

### JWT Flow
1. User logs in via Auth Service
2. JWT token generated with user ID and role
3. Token sent to frontend
4. Frontend includes token in all API requests
5. Auth middleware validates token
6. Request proceeds or rejected

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT expiration
- ✅ Refresh token rotation
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation with Zod
- ✅ SQL injection prevention

---

##  Environment Variables

Each service needs a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/travalee

# Cache
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d

# External Services
CLOUDINARY_URL=cloudinary://key:secret@cloud
RESEND_API_KEY=re_xxxxx

# Mail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

##  Docker Setup

### Docker Compose Services

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  mongo:
    image: mongo:7.2
    ports:
      - "27017:27017"
  
  auth:
    build: ./Services/Auth
    ports:
      - "3000:3000"
    depends_on:
      - redis
      - mongo
  
  hotel:
    build: ./Services/Hotel
    ports:
      - "3001:3001"
    depends_on:
      - redis
      - mongo
```

### Build and Run

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f service-name

# Stop all services
docker-compose down
```

---

##  API Documentation

### Base URLs
```
Auth Service:      http://localhost:3000/api
Hotel Service:     http://localhost:3001/api
Booking Service:   http://localhost:5002/api
Admin Service:     http://localhost:4001/api
Notifications:     http://localhost:6000/api
Chat Service:      http://localhost:*/api
Payment Service:   http://localhost:*/api
```

### Common Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "error": null
}
```

### Authentication Header

```
Authorization: Bearer <jwt_token>
```

---

##  Running Services

### Development Mode

```bash
cd Travallee-Backend/Services/Auth
npm run dev    # Auto-restart on changes
```

### Production Mode

```bash
npm run build
npm start
```

### Watch Mode

```bash
npm run watch
```

---

##  Debugging

### Enable Debug Logging

```bash
DEBUG=travallee:* npm run dev
```

### Check Service Health

```bash
# Service is running and responsive
curl http://localhost:3000/api/health
```

### View Logs

```bash
# Real-time logs
docker-compose logs -f auth

# Last 100 lines
docker-compose logs --tail=100
```

---

##  Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Coverage
npm run test:coverage
```

---

##  Deployment

### Staging
```bash
docker-compose -f docker-compose.staging.yml up -d
```

### Production
```bash
# Build optimized images
docker build -t travallee-auth:prod Services/Auth
docker build -t travallee-hotel:prod Services/Hotel

# Push to registry (optional)
docker push travallee-auth:prod

# Deploy via orchestration (K8s, Docker Swarm, etc.)
```

---

##  Related Documentation

- [Root README](../README.md) - Project overview
- [Setup Guide](../docs/SETUP.md) - Full setup
- [Architecture Guide](../docs/ARCHITECTURE.md) - System design
- Individual Service READMEs in each service directory

---

##  Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Follow TypeScript and code standards
3. Add tests for new features
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/name`
6. Create Pull Request

---

## Support
Check service-specific README files
Review API documentation
Check Docker logs
Verify environment variables
Ensure databases are running

---

**Backend Infrastructure of Travallee Hotel Management System**
