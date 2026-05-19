# 🔔 Notifications Service

The **Notifications Service** handles email, SMS, and push notifications. It provides templated messaging, delivery tracking, and multi-channel notification capabilities.

## 📋 Overview

Notifications Service manages:
- Email notifications (Resend)
- SMS notifications
- Push notifications (Expo)
- Notification templates
- Delivery tracking
- Retry mechanisms
- Notification preferences
- Bulk notifications

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Express.js 5.2 |
| **Language** | TypeScript 5.9 |
| **Database** | MongoDB + Mongoose |
| **Queue** | BullMQ |
| **Email** | Resend API |
| **SMS** | Twilio (configurable) |
| **Push** | Expo Notifications |

---

## 📂 Project Structure

```
notifications/
├── src/
│   ├── app.ts                      # Express app setup
│   ├── index.ts                    # Server entry point
│   ├── Controllers/                # Request handlers
│   │   ├── notification.controller.ts
│   │   └── template.controller.ts
│   ├── Routes/                     # Route definitions
│   │   ├── notification.routes.ts
│   │   └── template.routes.ts
│   ├── Models/                     # Data models
│   │   ├── Notification.ts         # Notification schema
│   │   └── Template.ts             # Email template schema
│   ├── Services/                   # Business logic
│   │   ├── notification.service.ts # Core logic
│   │   ├── email.service.ts        # Email sending
│   │   ├── sms.service.ts          # SMS sending
│   │   ├── push.service.ts         # Push notifications
│   │   └── template.service.ts     # Template management
│   ├── Jobs/                       # Background jobs
│   │   ├── sendEmail.job.ts        # Email job
│   │   ├── sendSms.job.ts          # SMS job
│   │   └── sendPush.job.ts         # Push job
│   ├── Templates/                  # Email templates
│   │   ├── welcome.html
│   │   ├── confirmation.html
│   │   └── ...
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
cd Travallee-Backend/Services/notifications

npm install
cp .env.example .env
```

### Environment Variables

```env
PORT=6000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/travalee_notifications
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secret_key

# Resend (Email)
RESEND_API_KEY=re_your_api_key
SENDER_EMAIL=noreply@travallee.com

# Twilio (SMS) - Optional
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Expo (Push Notifications)
EXPO_ACCESS_TOKEN=your_expo_token
```

### Start Development

```bash
npm run dev
```

Runs on: **http://localhost:6000**

---

## 🔌 API Endpoints

### Send Notification

```
POST /api/notifications/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "60d5ec49c1234567890abcde",
  "type": "email",
  "template": "booking_confirmation",
  "data": {
    "bookingNumber": "BK-2024-001",
    "hotelName": "Grand Hotel",
    "checkInDate": "2024-05-20"
  }
}
```

### Get Notification Status

```
GET /api/notifications/:notificationId
Authorization: Bearer <token>
```

### Get User Notifications

```
GET /api/notifications/user/me
Authorization: Bearer <token>
Query Parameters:
  - type: email|sms|push
  - status: pending|sent|failed
  - page: number
  - limit: number
```

### Preferences

#### Get Notification Preferences
```
GET /api/notifications/preferences
Authorization: Bearer <token>
```

#### Update Preferences
```
PUT /api/notifications/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true,
  "promotionalEmails": false
}
```

---

## 📧 Email Templates

### Built-in Templates

#### Welcome Email
**Template:** `welcome.html`
```
Hello {{firstName}},

Welcome to Travallee! We're excited to have you on board.

Best regards,
Travallee Team
```

#### Booking Confirmation
**Template:** `booking_confirmation.html`
```
Your booking is confirmed!

Booking Number: {{bookingNumber}}
Hotel: {{hotelName}}
Check-in: {{checkInDate}}
Check-out: {{checkOutDate}}
```

#### Check-in Reminder
**Template:** `checkin_reminder.html`
```
Your check-in is today!

Don't forget to check in by {{checkInTime}}.
```

#### Booking Cancellation
**Template:** `booking_cancellation.html`
```
Your booking has been cancelled.

Refund: {{refundAmount}}
Refund will be processed within 3-5 business days.
```

### Custom Templates

Create custom email templates:

```
POST /api/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "custom_promo",
  "subject": "Special Offer for You!",
  "html": "<h1>{{title}}</h1>...",
  "variables": ["title", "offerText"]
}
```

---

## 📱 Notification Types

### Email Notifications
- Booking confirmation
- Check-in reminder
- Check-out confirmation
- Cancellation notice
- Password reset
- Account verification
- Promotional offers

### SMS Notifications
- Booking confirmation (short)
- Check-in reminder
- Cancellation notice
- One-time passwords (OTP)

### Push Notifications
- Booking updates
- Check-in reminder
- New messages
- Special offers
- Account alerts

---

## 📁 Data Models

### Notification Model

```typescript
interface INotification {
  _id: ObjectId;
  userId: ObjectId;                 // Recipient
  type: 'email' | 'sms' | 'push';
  templateName: string;
  subject?: string;                 // For email
  body: string;
  data?: object;                    // Template variables
  status: 'pending' | 'sent' | 'failed';
  recipient: string;                // Email/phone/push token
  sentAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
}
```

### Template Model

```typescript
interface ITemplate {
  _id: ObjectId;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  body: string;
  htmlContent?: string;             // For email
  variables: string[];              // {{variable}} names
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎯 Sending Notifications

### Email Service

```typescript
import { emailService } from '@services/email.service';

await emailService.sendEmail({
  to: user.email,
  template: 'booking_confirmation',
  data: {
    bookingNumber: 'BK-2024-001',
    hotelName: 'Grand Hotel'
  }
});
```

### SMS Service

```typescript
import { smsService } from '@services/sms.service';

await smsService.sendSms({
  to: user.phone,
  message: `Booking confirmed! Confirmation #: ${bookingNumber}`
});
```

### Push Notification Service

```typescript
import { pushService } from '@services/push.service';

await pushService.sendPush({
  to: user.expoPushToken,
  title: 'Booking Confirmed',
  body: `Your booking at ${hotelName} is confirmed!`
});
```

---

## 🔄 Queue Processing

Using BullMQ for asynchronous sending:

### Email Queue
```typescript
await emailQueue.add('send', {
  userId: user._id,
  template: 'welcome',
  data: { firstName: user.firstName }
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 }
});
```

### Processing Jobs
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

## 📊 Delivery Tracking

Track notification delivery status:

```typescript
// Get delivery statistics
const stats = await notificationService.getStats({
  startDate: '2024-05-01',
  endDate: '2024-05-31',
  type: 'email'
});

// Response
{
  total: 1250,
  sent: 1200,
  failed: 40,
  pending: 10,
  successRate: 96
}
```

---

## 🔄 Retry Mechanism

Failed notifications are automatically retried:

```typescript
{
  maxRetries: 3,
  retryStrategy: {
    1: 60 * 1000,      // 1 minute
    2: 5 * 60 * 1000,  // 5 minutes
    3: 30 * 60 * 1000  // 30 minutes
  }
}
```

---

## 🔐 Security

- ✅ API key validation for all requests
- ✅ User can only access their own notifications
- ✅ Sensitive data not logged
- ✅ Rate limiting on API calls
- ✅ Validation of email/phone numbers
- ✅ Unsubscribe support for emails

---

## 🧪 Testing

```bash
npm test
```

---

## 🚀 Deployment

```bash
docker build -t travallee-notifications:latest .
docker run -p 6000:6000 --env-file .env travallee-notifications:latest
```

---

## 📚 Related Services

- **Auth Service** - User data
- **Booking Service** - Booking notifications
- **Hotel Service** - Hotel data

---

**Notifications Service of Travallee**
