# 📅 Booking Service

The **Booking & Reservation Management Service** handles creating, managing, and tracking hotel reservations. It manages the complete lifecycle of bookings from creation through checkout.

## 📋 Overview

Booking Service handles:
- Booking creation and confirmation
- Booking modification (dates, rooms)
- Booking cancellation
- Check-in/check-out management
- Booking history and archives
- Booking status tracking
- Guest communication
- Booking analytics

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Express.js 5.2 |
| **Language** | TypeScript 5.9 |
| **Database** | MongoDB + Mongoose |
| **Caching** | Redis |
| **Queue** | BullMQ |
| **Validation** | Zod |

---

## 📂 Project Structure

```
booking/
├── src/
│   ├── app.ts                      # Express app setup
│   ├── index.ts                    # Server entry point
│   ├── Controllers/                # Request handlers
│   │   └── booking.controller.ts   # Booking endpoints
│   ├── Routes/                     # Route definitions
│   │   └── booking.routes.ts       # Booking routes
│   ├── Models/                     # Data models
│   │   └── Booking.ts              # Booking schema
│   ├── Services/                   # Business logic
│   │   ├── booking.service.ts      # Booking operations
│   │   └── availability.service.ts # Availability checking
│   ├── Jobs/                       # Background jobs
│   │   ├── sendConfirmation.job.ts # Send confirmation emails
│   │   └── ...
│   ├── Schemas/                    # Validation schemas
│   │   └── booking.schema.ts       # Validation
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
cd Travallee-Backend/Services/booking

npm install
cp .env.example .env
```

### Environment Variables

```env
PORT=5002
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/travalee_booking
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secret_key

HOTEL_SERVICE_URL=http://localhost:3001
PAYMENT_SERVICE_URL=http://localhost:3002
NOTIFICATION_SERVICE_URL=http://localhost:6000
```

### Start Development

```bash
npm run dev
```

Runs on: **http://localhost:5002**

---

## 🔌 API Endpoints

### Create Booking

```
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "hotelId": "60d5ec49c1234567890abcde",
  "roomId": "60d5ec49c1234567890abcdf",
  "checkInDate": "2024-05-20T15:00:00Z",
  "checkOutDate": "2024-05-25T11:00:00Z",
  "guests": {
    "adults": 2,
    "children": 1
  },
  "specialRequests": "Late checkout if available"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abce0",
    "bookingNumber": "BK-2024-001",
    "status": "confirmed",
    "totalPrice": 750,
    "confirmationDetails": { ... }
  }
}
```

### Get Booking Details

```
GET /api/bookings/:bookingId
Authorization: Bearer <token>
```

### Get User's Bookings

```
GET /api/bookings/user/me
Authorization: Bearer <token>
Query Parameters:
  - status: confirmed|cancelled|completed
  - page: number
  - limit: number
```

### Modify Booking

```
PATCH /api/bookings/:bookingId
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkInDate": "2024-05-21T15:00:00Z",
  "checkOutDate": "2024-05-26T11:00:00Z"
}
```

### Cancel Booking

```
DELETE /api/bookings/:bookingId
Authorization: Bearer <token>

{
  "reason": "Personal emergency"
}
```

### Check-in

```
POST /api/bookings/:bookingId/check-in
Authorization: Bearer <token>
```

### Check-out

```
POST /api/bookings/:bookingId/check-out
Authorization: Bearer <token>
```

### Get Available Rooms

```
GET /api/bookings/availability
Query Parameters:
  - hotelId: string
  - checkIn: date (YYYY-MM-DD)
  - checkOut: date (YYYY-MM-DD)
  - guests: number
```

---

## 📁 Data Models

### Booking Model

```typescript
interface IBooking {
  _id: ObjectId;
  bookingNumber: string;           // Unique booking reference
  userId: ObjectId;                 // Guest (ref to User)
  hotelId: ObjectId;                // Hotel (ref to Hotel)
  roomId: ObjectId;                 // Room (ref to Room)
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  guests: {
    adults: number;
    children: number;
  };
  basePrice: number;                // Price per night
  totalPrice: number;               // Total booking cost
  taxAmount: number;
  discountAmount: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  specialRequests?: string;
  cancellationReason?: string;
  cancellationDate?: Date;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔄 Booking Lifecycle

```
1. CREATE BOOKING
   ↓
2. PAYMENT PROCESSING
   ↓
3. PAYMENT CONFIRMED
   ↓
4. BOOKING CONFIRMED (emails sent)
   ↓
5. CHECK-IN DATE ARRIVES
   ↓
6. GUEST CHECKS IN
   ↓
7. GUEST STAYS
   ↓
8. CHECK-OUT DATE
   ↓
9. GUEST CHECKS OUT
   ↓
10. BOOKING COMPLETED
```

---

## ✅ Availability Checking

### Algorithm

```typescript
async function checkAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  // Query existing bookings for this room
  const existingBookings = await Booking.find({
    roomId,
    status: { $in: ['confirmed', 'checked-in'] },
    checkOutDate: { $gt: checkIn },
    checkInDate: { $lt: checkOut }
  });
  
  // No overlapping bookings = available
  return existingBookings.length === 0;
}
```

---

## 💰 Price Calculation

### Total Price Formula

```
Total = (BasePrice × NumberOfNights) + Tax - Discount

Where:
- BasePrice = Room's nightly rate
- NumberOfNights = Difference between checkout and checkin
- Tax = Percentage-based or fixed amount
- Discount = Promotional discount if applicable
```

### Price Adjustments

- **Seasonal Rates** - Prices vary by season
- **Early Bird Discount** - Discount for early bookings
- **Group Discount** - Discount for multiple rooms
- **Loyalty Discount** - Loyalty program discounts

---

## 📨 Email Notifications

### Confirmation Email
- Sent immediately after booking
- Contains booking details
- Includes booking confirmation number

### Reminder Email
- Sent 24 hours before check-in
- Contains hotel address and check-in instructions

### Receipt Email
- Sent after check-out
- Contains invoice and total charges
- Includes feedback request

### Cancellation Email
- Sent when booking is cancelled
- Contains refund information

---

## 🔀 Background Jobs

Using BullMQ for asynchronous tasks:

### Send Confirmation Job
```typescript
await bookingQueue.add('sendConfirmation', {
  bookingId: booking._id,
  guestEmail: guest.email
}, { delay: 1000 }); // Execute after 1 second
```

### Send Reminder Job
```typescript
// Scheduled: 24 hours before check-in
await bookingQueue.add('sendReminder', {
  bookingId: booking._id
}, { delay: 24 * 60 * 60 * 1000 });
```

### Auto Check-out Job
```typescript
// Auto check-out if not done manually
await bookingQueue.add('autoCheckout', {
  bookingId: booking._id
}, { delay: checkout_time - now });
```

---

## 💳 Payment Integration

Booking service communicates with Payment Service:

```typescript
// After booking creation, initiate payment
const payment = await paymentService.createPayment({
  bookingId: booking._id,
  amount: booking.totalPrice,
  currency: 'USD',
  paymentMethod: 'credit_card'
});
```

### Payment Statuses

- **Pending** - Awaiting payment
- **Completed** - Successfully paid
- **Failed** - Payment failed
- **Refunded** - Money returned after cancellation

---

## 🔒 Security & Validation

- ✅ Only users can view their own bookings
- ✅ Hotel admins can view all hotel bookings
- ✅ Validate dates (checkout > checkin)
- ✅ Prevent overbooking
- ✅ Verify room capacity
- ✅ Validate guest count
- ✅ Rate limiting on booking creation

---

## 🧪 Testing

```bash
npm test
```

---

## 📚 Related Services

- **Hotel Service** - Room availability & details
- **Auth Service** - User authentication
- **Payment Service** - Process payments
- **Notification Service** - Send emails

---

## 🚀 Deployment

```bash
docker build -t travallee-booking:latest .
docker run -p 5002:5002 --env-file .env travallee-booking:latest
```

---

**Booking Management Service of Travallee**
