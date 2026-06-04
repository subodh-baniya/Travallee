# 👨‍💼 Admin Service

The **Admin & Analytics Service** provides system administrators and hotel managers with management tools, analytics, reporting, and system configuration capabilities.

## 📋 Overview

Admin Service provides:
- User management and roles
- Analytics and reporting
- System configuration
- Audit logging
- Hotel performance metrics
- Revenue analytics
- Guest analytics
- Admin dashboard data



---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Express.js 5.2 |
| **Language** | TypeScript 5.9 |
| **Database** | MongoDB + Mongoose |
| **Caching** | Redis |
| **Validation** | Zod |

---

## 📂 Project Structure

```
admin/
├── src/
│   ├── app.ts                      # Express app setup
│   ├── index.ts                    # Server entry point
│   ├── Controllers/                # Request handlers
│   │   ├── admin.controller.ts     # Admin endpoints
│   │   ├── analytics.controller.ts # Analytics endpoints
│   │   ├── user.controller.ts      # User management
│   │   └── audit.controller.ts     # Audit logs
│   ├── Routes/                     # Route definitions
│   │   ├── admin.routes.ts         # Admin routes
│   │   ├── analytics.routes.ts     # Analytics routes
│   │   └── audit.routes.ts         # Audit routes
│   ├── Models/                     # Data models
│   │   ├── AuditLog.ts             # Audit log schema
│   │   └── AdminConfig.ts          # System config
│   ├── Services/                   # Business logic
│   │   ├── admin.service.ts        # Admin operations
│   │   ├── analytics.service.ts    # Analytics logic
│   │   └── audit.service.ts        # Audit logging
│   └── Utils/                      # Helpers
│       └── ...
│
├── .env.example                    # Environment template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── Dockerfile                      # Docker configuration
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Installation

```bash
cd Travallee-Backend/Services/admin

npm install
cp .env.example .env
```

### Environment Variables

```env
PORT=4001
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/travalee_admin
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secret_key
```

### Start Development

```bash
npm run dev
```

Runs on: **http://localhost:4001**

---

## 🔌 API Endpoints

### User Management

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <token> (admin role required)
Query Parameters:
  - role: guest|hotel_admin|super_admin
  - status: active|inactive
  - page: number
  - limit: number
```

#### Get User by ID
```
GET /api/admin/users/:userId
Authorization: Bearer <token>
```

#### Update User Role
```
PATCH /api/admin/users/:userId/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "hotel_admin"
}
```

#### Deactivate User
```
POST /api/admin/users/:userId/deactivate
Authorization: Bearer <token>
```

#### Delete User
```
DELETE /api/admin/users/:userId
Authorization: Bearer <token>
```

---

### Analytics & Reporting

#### Get Dashboard Summary
```
GET /api/admin/analytics/dashboard
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalBookings": 3456,
    "totalRevenue": 567890.50,
    "occupancyRate": 78.5,
    "averageRating": 4.6
  }
}
```

#### Get Revenue Analytics
```
GET /api/admin/analytics/revenue
Authorization: Bearer <token>
Query Parameters:
  - startDate: date
  - endDate: date
  - groupBy: day|week|month
```

#### Get Booking Analytics
```
GET /api/admin/analytics/bookings
Authorization: Bearer <token>
Query Parameters:
  - startDate: date
  - endDate: date
```

#### Get Hotel Performance
```
GET /api/admin/analytics/hotels
Authorization: Bearer <token>
Query Parameters:
  - page: number
  - limit: number
```

#### Get Guest Demographics
```
GET /api/admin/analytics/guests
Authorization: Bearer <token>
```

---

### System Configuration

#### Get System Settings
```
GET /api/admin/settings
Authorization: Bearer <token> (super_admin only)
```

#### Update System Settings
```
PUT /api/admin/settings
Authorization: Bearer <token> (super_admin only)
Content-Type: application/json

{
  "maintenanceMode": false,
  "bookingWindow": 365,
  "cancellationFee": 10,
  "maxGuests": 10
}
```

#### Get Email Configuration
```
GET /api/admin/email-config
Authorization: Bearer <token>
```

#### Update Email Configuration
```
PUT /api/admin/email-config
Authorization: Bearer <token>
Content-Type: application/json

{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "sender": "noreply@travallee.com"
}
```

---

### Audit Logging

#### Get Audit Logs
```
GET /api/admin/audit-logs
Authorization: Bearer <token>
Query Parameters:
  - userId: string
  - action: string
  - resource: string
  - page: number
  - limit: number
```

#### Get Activity by User
```
GET /api/admin/audit-logs/user/:userId
Authorization: Bearer <token>
```

---

## 📊 Analytics Dashboards

### Revenue Dashboard
- Total revenue (all time, this month, this week)
- Revenue trends (line chart)
- Revenue by hotel
- Revenue by payment method
- Top performing hotels

### Booking Dashboard
- Total bookings
- Bookings by status
- Average booking value
- Booking trends
- Cancellation rate

### Guest Analytics
- Total guests
- New guests this month
- Guest retention rate
- Guest locations
- Guest satisfaction scores

### Hotel Performance
- Occupancy rates by hotel
- Average daily rate (ADR)
- Revenue per available room (RevPAR)
- Hotel ratings
- Guest reviews

---

## 📁 Data Models

### Audit Log Model

```typescript
interface IAuditLog {
  _id: ObjectId;
  userId: ObjectId;                 // Admin who performed action
  action: string;                   // create|update|delete|login|logout
  resource: string;                 // user|hotel|booking|room
  resourceId: ObjectId;
  oldValues?: object;               // Previous values if update
  newValues?: object;               // New values if update
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
```

### Admin Config Model

```typescript
interface IAdminConfig {
  _id: ObjectId;
  maintenanceMode: boolean;
  bookingWindow: number;            // Days in advance to book
  cancellationFee: number;          // Percentage
  maxGuestsPerRoom: number;
  taxRate: number;                  // Percentage
  emailConfig: {
    smtpHost: string;
    smtpPort: number;
    sender: string;
  };
  updatedAt: Date;
}
```

---

## 🔐 Role-Based Access Control

### Roles

| Role | Permissions |
|------|-------------|
| **guest** | View own bookings, profile |
| **hotel_admin** | Manage own hotel, view analytics |
| **super_admin** | Manage all, system config, all analytics |

### Role Checks

```typescript
// Middleware to verify admin role
app.get('/api/admin/users', requireRole('super_admin'), handler);
app.get('/api/admin/analytics', requireRole(['super_admin', 'hotel_admin']), handler);
```

---

## 📊 Analytics Calculations

### Occupancy Rate
```
Occupancy = (BookedRooms / TotalRooms) × 100
```

### Average Daily Rate (ADR)
```
ADR = TotalRoomRevenue / NumberOfRoomsBooked
```

### Revenue Per Available Room (RevPAR)
```
RevPAR = TotalRevenue / TotalAvailableRoomDays
```

### Guest Satisfaction Score
```
Score = (Sum of Ratings / Total Reviews) × 100
```

---

## 🔍 Audit Logging

Every admin action is logged:

### Logged Actions
- User creation/modification/deletion
- Role changes
- Hotel updates
- System configuration changes
- Sensitive operations

### Audit Entry Example
```json
{
  "_id": "60d5ec49c1234567890abce0",
  "userId": "60d5ec49c1234567890abcde",
  "action": "update",
  "resource": "user",
  "resourceId": "60d5ec49c1234567890abcdf",
  "oldValues": { "role": "guest" },
  "newValues": { "role": "hotel_admin" },
  "ipAddress": "192.168.1.1",
  "timestamp": "2024-05-20T10:30:00Z"
}
```

---

## 📈 Report Generation

### Supported Reports
- Revenue Report (PDF/CSV)
- Booking Report
- Guest Report
- Hotel Performance Report
- Occupancy Report

```typescript
// Generate report
const report = await analyticsService.generateReport({
  type: 'revenue',
  format: 'pdf',
  startDate: '2024-01-01',
  endDate: '2024-05-31'
});
```

---

## 🧪 Testing

```bash
npm test
```

---

## 🚀 Deployment

```bash
docker build -t travallee-admin:latest .
docker run -p 4001:4001 --env-file .env travallee-admin:latest
```

---

## 📚 Related Services

- **Auth Service** - Admin authentication
- **Hotel Service** - Hotel data for analytics
- **Booking Service** - Booking data
- **Notification Service** - Send reports

---

**Admin Service of Travallee**
