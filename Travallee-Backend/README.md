# Backend Services Setup Guide

Complete guide to setting up and running the Travallee backend microservices.

## Quick Start

### Option 1: Docker Compose (Recommended - Single Command)

```bash
cd Travallee-Backend
docker-compose up -d

# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f auth

# Stop all services
docker-compose down
```

**Services started:**
- Auth Service: `http://localhost:3000`
- Admin Service: `http://localhost:4001`
- Booking Service: `http://localhost:5002`
- Hotel Service: `http://localhost:5003`
- MongoDB: `mongodb://localhost:27017`

### Option 2: Manual Setup (Individual Services)

```bash
# Terminal 1: Auth Service
cd Travallee-Backend/Services/Auth
npm install
npm run dev

# Terminal 2: Admin Service
cd ../admin
npm install
npm run dev

# Terminal 3: Booking Service
cd ../booking
npm install
npm run dev

# Terminal 4: Hotel Service
cd ../Hotel
npm install
npm run dev
```

---

## Services Overview

### Architecture

```
┌──────────────────────────────────────────┐
│         Frontend Layer                   │
│  ┌─────────────────────┐                │
│  │  Admin Dashboard    │                │
│  │  User Website       │                │
│  │  Mobile App (Expo)  │                │
│  └─────────────────────┘                │
└──────────────────────────────────────────┘
           ↓ API Calls
┌──────────────────────────────────────────┐
│    API Gateway / Load Balancer           │
│    (Optional - Route requests)           │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│       Microservices Layer                │
│  ┌─────────────────────────────────────┐ │
│  │  Auth Service (Port 3000)           │ │
│  │  - User registration/login          │ │
│  │  - JWT token generation             │ │
│  │  - OAuth integration                │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  Admin Service (Port 4001)          │ │
│  │  - User & staff management          │ │
│  │  - System settings                  │ │
│  │  - Analytics & reporting            │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  Hotel Service (Port 5003)          │ │
│  │  - Room management                  │ │
│  │  - Pricing & availability           │ │
│  │  - Inventory tracking               │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  Booking Service (Port 5002)        │ │
│  │  - Reservations                     │ │
│  │  - Check-in/out                     │ │
│  │  - Booking history                  │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  Notification Service (Optional)    │ │
│  │  - Email notifications              │ │
│  │  - SMS alerts                       │ │
│  │  - Push notifications               │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  Payment Service (Optional)         │ │
│  │  - Stripe integration               │ │
│  │  - PayPal / Razorpay                │ │
│  │  - Transaction logging              │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
           ↓ Database queries
┌──────────────────────────────────────────┐
│       Data Layer                         │
│  ┌─────────────────────────────────────┐ │
│  │  MongoDB / SQL Database             │ │
│  │  (Shared or Service-specific DB)    │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  Redis Cache (Optional)             │ │
│  │  (Availability, rates, sessions)    │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## Individual Service Setup

### Auth Service

**Purpose:** Handle user authentication, registration, JWT tokens

**Location:** `Travallee-Backend/Services/Auth/`

**Dependencies:**
- MongoDB (for user storage)
- Email service (SMTP for password reset)

**Setup:**
```bash
cd Travallee-Backend/Services/Auth

# Install dependencies
npm install

# Create .env file
cp .env.sample .env

# Configure in .env:
NODE_ENV=development
PORT=3000
DB_URI=mongodb://localhost:27017/travallee
JWT_SECRET=your-secret-key-here

# Start development server
npm run dev

# Alternative: npm start (production mode)
```

**API Endpoints:**
```
POST   /api/v1/auth/register        - Create account
POST   /api/v1/auth/login           - Get JWT token
POST   /api/v1/auth/refresh         - Refresh token
GET    /api/v1/auth/profile         - Get user profile
POST   /api/v1/auth/logout          - Invalid token
POST   /api/v1/auth/forgot-password - Reset password
```

**Test Credentials:**
```
Email: admin@travallee.com
Password: admin123
```

---

### Admin Service

**Purpose:** Admin dashboard backend, user management, analytics

**Location:** `Travallee-Backend/Services/admin/`

**Setup:**
```bash
cd Travallee-Backend/Services/admin

npm install
cp .env.sample .env

# Configure .env:
NODE_ENV=development
PORT=4001
AUTH_SERVICE_URL=http://localhost:3000/api/v1

npm run dev
```

**API Endpoints:**
```
GET    /api/v1/admin/dashboard      - Dashboard metrics
GET    /api/v1/admin/users          - List users
POST   /api/v1/admin/users          - Create user
PUT    /api/v1/admin/users/:id      - Update user
DELETE /api/v1/admin/users/:id      - Delete user
GET    /api/v1/admin/analytics      - Analytics data
```

---

### Hotel Service

**Purpose:** Room management, pricing, availability tracking

**Location:** `Travallee-Backend/Services/Hotel/`

**Setup:**
```bash
cd Travallee-Backend/Services/Hotel

npm install
cp .env.sample .env

# Configure .env:
NODE_ENV=development
PORT=5003
AUTH_SERVICE_URL=http://localhost:3000/api/v1
REDIS_HOST=localhost

npm run dev
```

**API Endpoints:**
```
GET    /api/v1/hotel/rooms          - List all rooms
GET    /api/v1/hotel/rooms/:id      - Get room details
POST   /api/v1/hotel/rooms          - Create room
PUT    /api/v1/hotel/rooms/:id      - Update room
DELETE /api/v1/hotel/rooms/:id      - Delete room
GET    /api/v1/hotel/availability   - Check availability
GET    /api/v1/hotel/pricing        - Get prices
```

---

### Booking Service

**Purpose:** Handle reservations, check-in/out, booking history

**Location:** `Travallee-Backend/Services/booking/`

**Setup:**
```bash
cd Travallee-Backend/Services/booking

npm install
cp .env.sample .env

# Configure .env:
NODE_ENV=development
PORT=5002
AUTH_SERVICE_URL=http://localhost:3000/api/v1
HOTEL_SERVICE_URL=http://localhost:5003/api/v1

npm run dev
```

**API Endpoints:**
```
GET    /api/v1/bookings             - List bookings
POST   /api/v1/bookings             - Create booking
GET    /api/v1/bookings/:id         - Get booking
PUT    /api/v1/bookings/:id         - Update booking
DELETE /api/v1/bookings/:id         - Cancel booking
POST   /api/v1/bookings/:id/checkin - Check in
POST   /api/v1/bookings/:id/checkout- Check out
```

---

## Environment Variables

See [ENV.md](../ENV.md) for comprehensive environment variable documentation.

Quick setup:
```bash
# Auth Service
cat > Travallee-Backend/Services/Auth/.env << 'EOF'
NODE_ENV=development
PORT=3000
DB_URI=mongodb://localhost:27017/travallee
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
EOF

# Admin Service
cat > Travallee-Backend/Services/admin/.env << 'EOF'
NODE_ENV=development
PORT=4001
AUTH_SERVICE_URL=http://localhost:3000/api/v1
DB_URI=mongodb://localhost:27017/travallee_admin
JWT_SECRET=your-super-secret-key-change-this
EOF

# Hotel Service
cat > Travallee-Backend/Services/Hotel/.env << 'EOF'
NODE_ENV=development
PORT=5003
AUTH_SERVICE_URL=http://localhost:3000/api/v1
DB_URI=mongodb://localhost:27017/travallee_hotel
REDIS_HOST=localhost
EOF

# Booking Service
cat > Travallee-Backend/Services/booking/.env << 'EOF'
NODE_ENV=development
PORT=5002
AUTH_SERVICE_URL=http://localhost:3000/api/v1
HOTEL_SERVICE_URL=http://localhost:5003/api/v1
DB_URI=mongodb://localhost:27017/travallee_bookings
EOF
```

---

## Database Setup

### MongoDB (Recommended for Development)

**Option 1: Docker**
```bash
docker run -d \
  --name travallee-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7.0

# Connect with MongoDB Compass at:
# mongodb://admin:password@localhost:27017
```

**Option 2: Local Installation**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install -y mongodb
sudo systemctl start mongodb

# Windows
# Download and run installer from https://www.mongodb.com/try/download/community
```

**Option 3: MongoDB Atlas (Cloud)**
```
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/
4. Update DB_URI in .env files
```

### PostgreSQL (Alternative)

```bash
# Docker
docker run -d \
  --name travallee-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=travallee \
  -p 5432:5432 \
  postgres:16

# Local
brew install postgresql
brew services start postgresql
```

---

## Running with Docker Compose

### Full Stack (All Services + Database)

**File:** `docker-compose.yml`

```bash
# Start all services
docker-compose up -d

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (careful - deletes data!)
docker-compose down -v

# Rebuild images after code changes
docker-compose up -d --build
```

### Service-Specific Commands

```bash
# Start only specific services
docker-compose up -d auth hotel

# Restart single service
docker-compose restart auth

# View service logs
docker-compose logs -f auth
docker-compose logs -f booking
docker-compose logs -f hotel

# Access service shell
docker-compose exec auth bash
docker-compose exec mongodb mongosh
```

---

## Troubleshooting

### Port Already in Use

**Problem:** `Port 3000 is already in use`

**Solutions:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Use different port
PORT=3001 npm run dev

# Check what's using the port
lsof -i :3000
```

### MongoDB Connection Refused

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
```bash
# Start MongoDB
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Docker
docker start travallee-mongodb

# Or let docker-compose handle it
docker-compose up -d
```

### Service Can't Reach Other Services

**Problem:** `Error: connect ECONNREFUSED when calling other service`

**In Docker Compose:**
- Services communicate via service name: `http://auth:3000`
- Not `http://localhost:3000`

**Locally:**
- Make sure all services are running
- Use `http://localhost:PORT`

**Cross-network:**
- Use actual IP address
- Update service URLs in .env files
- Example: `http://192.168.1.100:3000`

### Environment Variables Not Loaded

**Problem:** `process.env.JWT_SECRET is undefined`

**Solutions:**
```bash
# Restart application after editing .env
npm run dev

# Verify .env file exists
ls -la .env

# Check variable is set
cat .env | grep JWT_SECRET

# Ensure no spaces around = sign
# ✅ Correct: JWT_SECRET=value
# ❌ Wrong: JWT_SECRET = value
```

---

## Development Best Practices

### Logging

```javascript
// Use appropriate log levels
console.log('Info message');      // Info
console.error('Error message');   // Error
console.warn('Warning message');  // Warning
console.debug('Debug message');   // Debug

// In production, use logger library
import logger from './utils/logger';
logger.info('User login', { userId: 123 });
logger.error('Payment failed', { error: err });
```

### Error Handling

```javascript
// Always return proper HTTP status codes
200 - OK
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
500 - Server Error

// Example
try {
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(user);
} catch (err) {
  res.status(500).json({ error: err.message });
}
```

### Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## Monitoring & Debugging

### Health Checks

```bash
# Check service is running
curl http://localhost:3000/health

# Expected response:
# {"status": "ok", "service": "auth", "uptime": 1234}
```

### Performance Monitoring

```bash
# View CPU and memory usage
docker-compose stats

# Or locally
npm install -g clinic
clinic doctor -- npm run dev
```

### Request Logging

Enable request logging in development:
```javascript
import morgan from 'morgan';
app.use(morgan('dev')); // Logs all HTTP requests
```

---

## Deployment

### Build Docker Images

```bash
# Build single service
cd Travallee-Backend/Services/Auth
docker build -t travallee-auth:latest .

# Build all services
docker-compose build

# Push to registry
docker push your-registry/travallee-auth:latest
```

### Deploy to Production

```bash
# Using Docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Using Kubernetes
kubectl apply -f k8s/

# Using AWS ECS, Google Cloud Run, etc.
# Follow provider-specific instructions
```

---

## Service Communication

### Inter-Service Calls

**From Admin Service to Auth Service:**
```javascript
const response = await fetch(
  `${process.env.AUTH_SERVICE_URL}/api/v1/auth/verify`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  }
);
```

### Message Queue Setup (Optional)

For async operations (emails, notifications):
```bash
# Start RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

# Access management UI
# http://localhost:15672
# Default: guest / guest
```

---

## Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Design Guide](https://restfulapi.net/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)

---

## Next Steps

1. [Setup Environment Variables](../ENV.md)
2. [Frontend Setup](../Admin-Frontend/SETUP.md)
3. [Architecture Overview](../docs/ARCHITECTURE.md)
4. [Contributing Guidelines](../CONTRIBUTING.md)
