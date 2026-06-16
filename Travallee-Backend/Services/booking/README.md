# Booking Service

The **Booking and Reservation Management Service** handles creating, managing, and tracking hotel reservations. It manages the complete booking lifecycle from reservation creation through guest checkout.

## Overview

The Booking Service is responsible for:

* Booking creation and confirmation
* Booking modification (dates and rooms)
* Booking cancellation
* Check-in and check-out management
* Booking history and archival
* Booking status tracking
* Guest communication
* Booking analytics and reporting

---

## Tech Stack

| Component            | Technology         |
| -------------------- | ------------------ |
| **Framework**        | Express.js 5.2     |
| **Language**         | TypeScript 5.9     |
| **Database**         | MongoDB + Mongoose |
| **Caching**          | Redis              |
| **Queue Management** | BullMQ             |
| **Validation**       | Zod                |

---

## Project Structure

```text
booking/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── Controllers/
│   │   └── booking.controller.ts
│   ├── Routes/
│   │   └── booking.routes.ts
│   ├── Models/
│   │   └── Booking.ts
│   ├── Services/
│   │   ├── booking.service.ts
│   │   └── availability.service.ts
│   ├── Jobs/
│   │   ├── sendConfirmation.job.ts
│   │   └── ...
│   ├── Schemas/
│   │   └── booking.schema.ts
│   └── Utils/
│       └── ...
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

### Start Development Server

```bash
npm run dev
```

The service runs on:

```text
http://localhost:5002
```

---

## API Endpoints

### Booking Management

| Method | Endpoint                             | Description                 |
| ------ | ------------------------------------ | --------------------------- |
| POST   | `/api/bookings`                      | Create a booking            |
| GET    | `/api/bookings/:bookingId`           | Get booking details         |
| GET    | `/api/bookings/user/me`              | Get current user's bookings |
| PATCH  | `/api/bookings/:bookingId`           | Modify a booking            |
| DELETE | `/api/bookings/:bookingId`           | Cancel a booking            |
| POST   | `/api/bookings/:bookingId/check-in`  | Check in guest              |
| POST   | `/api/bookings/:bookingId/check-out` | Check out guest             |
| GET    | `/api/bookings/availability`         | Check room availability     |

---

## Data Model

### Booking Interface

```typescript
interface IBooking {
  _id: ObjectId;
  bookingNumber: string;
  userId: ObjectId;
  hotelId: ObjectId;
  roomId: ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  guests: {
    adults: number;
    children: number;
  };
  basePrice: number;
  totalPrice: number;
  taxAmount: number;
  discountAmount: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'checked-in'
    | 'checked-out'
    | 'cancelled';
  paymentStatus:
    | 'pending'
    | 'completed'
    | 'refunded';
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

## Booking Lifecycle

```text
1. Create Booking
2. Process Payment
3. Confirm Payment
4. Confirm Booking
5. Guest Check-In
6. Guest Stay
7. Guest Check-Out
8. Complete Booking
```

---

## Availability Management

### Availability Check

The service verifies room availability before confirming a reservation by checking for overlapping bookings within the requested date range.

```typescript
async function checkAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const existingBookings = await Booking.find({
    roomId,
    status: { $in: ['confirmed', 'checked-in'] },
    checkOutDate: { $gt: checkIn },
    checkInDate: { $lt: checkOut }
  });

  return existingBookings.length === 0;
}
```

---

## Pricing and Billing

### Price Calculation

```text
Total Price =
(Base Price × Number of Nights)
+ Taxes
- Discounts
```

### Supported Pricing Adjustments

* Seasonal pricing
* Early booking discounts
* Group booking discounts
* Loyalty program discounts
* Promotional offers

---

## Notifications

The service can trigger the following booking-related notifications:

### Confirmation Email

Sent immediately after booking confirmation and includes:

* Booking reference number
* Reservation details
* Guest information

### Reminder Email

Sent before check-in and includes:

* Hotel information
* Check-in instructions
* Reservation summary

### Receipt Email

Sent after checkout and includes:

* Invoice
* Total charges
* Feedback request

### Cancellation Email

Sent when a booking is cancelled and includes:

* Cancellation details
* Refund information

---

## Background Jobs

BullMQ is used for asynchronous processing.

### Confirmation Email Job

```typescript
await bookingQueue.add('sendConfirmation', {
  bookingId: booking._id,
  guestEmail: guest.email
});
```

### Reminder Email Job

```typescript
await bookingQueue.add('sendReminder', {
  bookingId: booking._id
});
```

### Automatic Checkout Job

```typescript
await bookingQueue.add('autoCheckout', {
  bookingId: booking._id
});
```

---

## Payment Integration

The Booking Service integrates with the Payment Service to process reservation payments.

```typescript
const payment = await paymentService.createPayment({
  bookingId: booking._id,
  amount: booking.totalPrice,
  currency: 'Nepali',
  paymentMethod: 'Esewa, Khalti'
});
```

### Payment Statuses

* Pending
* Completed
* Failed
* Refunded

---

## Security and Validation

1. Users can access only their own bookings.
2. Hotel administrators can access hotel-specific bookings.
3. Check-in and check-out dates are validated.
4. Overbooking prevention is enforced.
5. Room capacity validation is applied.
6. Guest count validation is required.
7. Rate limiting is applied to booking creation requests.

---

## Testing

Run the test suite:

```bash
npm test
```

---

## Related Services

* Auth Service
* Hotel Service
* Payment Service
* Notification Service

---

## Deployment

### Docker

```bash
docker build -t travallee-booking:latest .

docker run \
  -p 5002:5002 \
  --env-file .env \
  travallee-booking:latest
```

### Docker Compose

```bash
docker-compose up booking
```

---

## Development Guidelines

1. Follow TypeScript best practices.
2. Keep services modular and maintainable.
3. Validate all incoming requests.
4. Write tests for new features.
5. Document API changes.
6. Use environment variables for configuration.
7. Follow existing project conventions.

---

## Support

1. Review service logs for runtime issues.
2. Verify MongoDB and Redis connectivity.
3. Confirm environment variables are configured correctly.
4. Check integration endpoints for dependent services.

---


**Booking and Reservation Management Service for the Travallee Hotel Management System**
