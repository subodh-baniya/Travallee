# Notifications Service

The **Notifications Service** handles email, SMS, and push notifications across the Travallee platform. It provides templated messaging, delivery tracking, retry mechanisms, and multi-channel notification capabilities.

---

# Overview

The Notifications Service is responsible for:

* Email notifications (Resend)
* SMS notifications
* Push notifications (Expo)
* Notification template management
* Delivery tracking and reporting
* Retry mechanisms for failed deliveries
* User notification preferences
* Bulk notification support

---

# Tech Stack

| Component          | Technology            |
| ------------------ | --------------------- |
| Framework          | Express.js 5.2        |
| Language           | TypeScript 5.9        |
| Database           | MongoDB + Mongoose    |
| Queue              | BullMQ                |
| Email Provider     | Resend API            |
| SMS Provider       | Twilio (Configurable) |
| Push Notifications | Expo Notifications    |

---

# Project Structure

```text
notifications/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── Controllers/
│   │   ├── notification.controller.ts
│   │   └── template.controller.ts
│   ├── Routes/
│   │   ├── notification.routes.ts
│   │   └── template.routes.ts
│   ├── Models/
│   │   ├── Notification.ts
│   │   └── Template.ts
│   ├── Services/
│   │   ├── notification.service.ts
│   │   ├── email.service.ts
│   │   ├── sms.service.ts
│   │   ├── push.service.ts
│   │   └── template.service.ts
│   ├── Jobs/
│   │   ├── sendEmail.job.ts
│   │   ├── sendSms.job.ts
│   │   └── sendPush.job.ts
│   ├── Templates/
│   │   ├── welcome.html
│   │   ├── confirmation.html
│   │   └── ...
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

# Getting Started

## Prerequisites

* Node.js 18+
* MongoDB
* Redis

## Installation

```bash
cd Travallee-Backend/Services/notifications

npm install
cp .env.example .env
```

## Environment Variables

```env
PORT=6000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/travalee_notifications
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secret_key

# Resend (Email)
RESEND_API_KEY=re_your_api_key
SENDER_EMAIL=noreply@travallee.com

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Expo Push Notifications
EXPO_ACCESS_TOKEN=your_expo_token
```

## Run Development Server

```bash
npm run dev
```

Server runs on:

```text
http://localhost:6000
```

---

# API Endpoints

## Notifications

### Send Notification

```http
POST /api/notifications/send
```

### Get Notification Status

```http
GET /api/notifications/:notificationId
```

### Get User Notifications

```http
GET /api/notifications/user/me
```

Query Parameters:

* `type=email|sms|push`
* `status=pending|sent|failed`
* `page`
* `limit`

---

## Notification Preferences

### Get Preferences

```http
GET /api/notifications/preferences
```

### Update Preferences

```http
PUT /api/notifications/preferences
```

Example:

```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true,
  "promotionalEmails": false
}
```

---

# Email Templates

## Built-in Templates

### Welcome Email

Template: `welcome.html`

```html
Hello {{firstName}},

Welcome to Travallee! We're excited to have you on board.

Best regards,
Travallee Team
```

### Booking Confirmation

Template: `booking_confirmation.html`

```html
Your booking is confirmed!

Booking Number: {{bookingNumber}}
Hotel: {{hotelName}}
Check-in: {{checkInDate}}
Check-out: {{checkOutDate}}
```

### Check-in Reminder

Template: `checkin_reminder.html`

```html
Your check-in is today!

Don't forget to check in by {{checkInTime}}.
```

### Booking Cancellation

Template: `booking_cancellation.html`

```html
Your booking has been cancelled.

Refund: {{refundAmount}}
Refund will be processed within 3–5 business days.
```

---

# Notification Types

## Email Notifications

* Booking confirmation
* Check-in reminder
* Check-out confirmation
* Cancellation notice
* Password reset
* Account verification
* Promotional offers

## SMS Notifications

* Booking confirmation
* Check-in reminder
* Cancellation notice
* One-time passwords (OTP)

## Push Notifications

* Booking updates
* Check-in reminders
* New messages
* Special offers
* Account alerts

---

# Data Models

## Notification Model

```typescript
interface INotification {
  _id: ObjectId;
  userId: ObjectId;
  type: 'email' | 'sms' | 'push';
  templateName: string;
  subject?: string;
  body: string;
  data?: object;
  status: 'pending' | 'sent' | 'failed';
  recipient: string;
  sentAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
}
```

## Template Model

```typescript
interface ITemplate {
  _id: ObjectId;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  body: string;
  htmlContent?: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

# Notification Delivery

## Email Service

```typescript
await emailService.sendEmail({
  to: user.email,
  template: 'booking_confirmation',
  data: {
    bookingNumber: 'BK-2024-001',
    hotelName: 'Grand Hotel'
  }
});
```

## SMS Service

```typescript
await smsService.sendSms({
  to: user.phone,
  message: `Booking confirmed! Confirmation #: ${bookingNumber}`
});
```

## Push Notification Service

```typescript
await pushService.sendPush({
  to: user.expoPushToken,
  title: 'Booking Confirmed',
  body: `Your booking at ${hotelName} is confirmed!`
});
```

---

# Queue Processing

BullMQ is used for asynchronous notification processing.

## Email Queue Example

```typescript
await emailQueue.add('send', {
  userId: user._id,
  template: 'welcome',
  data: {
    firstName: user.firstName
  }
}, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
});
```

## Job Processing Example

```typescript
emailQueue.process(async (job) => {
  const { userId, template, data } = job.data;

  await emailService.sendEmail({
    to: user.email,
    template,
    data
  });

  return { success: true };
});
```

---

# Delivery Tracking

Monitor notification delivery statistics:

```typescript
const stats = await notificationService.getStats({
  startDate: '2024-05-01',
  endDate: '2024-05-31',
  type: 'email'
});
```

Example Response:

```json
{
  "total": 1250,
  "sent": 1200,
  "failed": 40,
  "pending": 10,
  "successRate": 96
}
```

---

# Retry Mechanism

Failed notifications are retried automatically.

```typescript
{
  maxRetries: 3,
  retryStrategy: {
    1: 60000,
    2: 300000,
    3: 1800000
  }
}
```

---

# Security

The service includes:

1. API key validation for all requests
2. User-level access control
3. Secure handling of sensitive information
4. Rate limiting protection
5. Email and phone number validation
6. Email unsubscribe support

---

# Testing

Run automated tests:

```bash
npm test
```

---

# Deployment

## Docker

```bash
docker build -t travallee-notifications:latest .

docker run \
  -p 6000:6000 \
  --env-file .env \
  travallee-notifications:latest
```

---

# Related Services

* Auth Service – User authentication and account data
* Booking Service – Booking-related notifications
* Hotel Service – Hotel information and reservation data

---

# Support

For troubleshooting:

1. Verify environment variables are configured correctly.
2. Ensure MongoDB and Redis are running.
3. Check notification queue status.
4. Review application logs for delivery failures.
5. Verify third-party provider credentials (Resend, Twilio, Expo).

---

# License

This service is part of the Travallee Hotel Management System.
