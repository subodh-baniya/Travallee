# Payment Service

The **Payment Processing Service** handles payment processing, invoicing, refunds, and financial transactions across the Travallee platform. It integrates with payment gateways and manages the complete payment lifecycle securely and efficiently.

---

# Overview

The Payment Service is responsible for:

* Payment processing (credit cards, digital wallets, bank transfers)
* Invoice generation and management
* Refund processing
* Transaction tracking
* Payment history and reconciliation
* Receipt generation
* Multiple payment method support
* Payment security and compliance

---

# Tech Stack

| Component        | Technology            |
| ---------------- | --------------------- |
| Framework        | Express.js 5.2        |
| Language         | TypeScript 5.9        |
| Database         | MongoDB + Mongoose    |
| Caching          | Redis                 |
| Payment Gateway  | Stripe (Configurable) |
| Queue Processing | BullMQ                |

---

# Project Structure

```text
payments/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── Controllers/
│   │   ├── payment.controller.ts
│   │   ├── invoice.controller.ts
│   │   └── refund.controller.ts
│   ├── Routes/
│   │   ├── payment.routes.ts
│   │   ├── invoice.routes.ts
│   │   └── refund.routes.ts
│   ├── Models/
│   │   ├── Payment.ts
│   │   ├── Invoice.ts
│   │   └── Refund.ts
│   ├── Services/
│   │   ├── payment.service.ts
│   │   ├── stripe.service.ts
│   │   ├── invoice.service.ts
│   │   └── refund.service.ts
│   ├── Jobs/
│   │   ├── processPayment.job.ts
│   │   └── sendReceipt.job.ts
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
* Stripe Account (for payment processing)

## Installation

```bash
cd Travallee-Backend/Services/payments

npm install
cp .env.example .env
```

## Environment Variables

```env
PORT=3002
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/travalee_payments
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Currency
DEFAULT_CURRENCY=USD

# Notifications
NOTIFICATION_SERVICE_URL=http://localhost:6000
```

## Start Development Server

```bash
npm run dev
```

Server runs on:

```text
http://localhost:3002
```

---

# API Endpoints

## Payments

### Create Payment

```http
POST /api/payments/create
```

### Get Payment Details

```http
GET /api/payments/:paymentId
```

### Get Payment History

```http
GET /api/payments/user/me
```

### Confirm Payment

```http
POST /api/payments/:paymentId/confirm
```

### Refund Payment

```http
POST /api/payments/:paymentId/refund
```

---

## Invoices

### Generate Invoice

```http
POST /api/invoices/generate
```

### Get Invoice

```http
GET /api/invoices/:invoiceId
```

### Download Invoice PDF

```http
GET /api/invoices/:invoiceId/download
```

---

## Refunds

### Get Refund Status

```http
GET /api/refunds/:refundId
```

### List User Refunds

```http
GET /api/refunds/user/me
```

---

# Data Models

## Payment Model

```typescript
interface IPayment {
  _id: ObjectId;
  bookingId: ObjectId;
  userId: ObjectId;
  hotelId: ObjectId;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: {
    type: 'card' | 'wallet' | 'bank_transfer';
    last4?: string;
    brand?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  failureReason?: string;
  metadata: object;
  createdAt: Date;
  updatedAt: Date;
}
```

## Invoice Model

```typescript
interface IInvoice {
  _id: ObjectId;
  invoiceNumber: string;
  paymentId: ObjectId;
  bookingId: ObjectId;
  userId: ObjectId;
  hotelId: ObjectId;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: 'draft' | 'issued' | 'paid' | 'void';
  issuedDate: Date;
  dueDate: Date;
  pdfUrl?: string;
  createdAt: Date;
}
```

## Refund Model

```typescript
interface IRefund {
  _id: ObjectId;
  refundNumber: string;
  paymentId: ObjectId;
  bookingId: ObjectId;
  userId: ObjectId;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: Date;
  receiptUrl?: string;
  createdAt: Date;
}
```

---

# Supported Payment Methods

The service supports:

1. Credit Cards (Visa, Mastercard, American Express)
2. Debit Cards
3. Apple Pay
4. Google Pay
5. Bank Transfers
6. Saved Payment Methods

Example:

```json
{
  "saveCard": true,
  "paymentMethodId": "pm_..."
}
```

---

# Invoice Management

Invoices are automatically generated after successful payments and include:

* Booking details
* Hotel information
* Customer information
* Itemized charges
* Tax calculations
* Discounts
* Transaction references
* Downloadable PDF receipts

---

# Refund Management

## Automatic Refund Flow

1. Booking cancellation is initiated.
2. Refund request is created automatically.
3. Refund is processed through the original payment method.
4. Payment gateway confirms the refund.
5. Customer receives refund confirmation.

## Manual Refund Flow

1. Hotel administrator requests a refund.
2. Refund amount is validated.
3. Refund is processed.
4. Customer receives notification.

## Refund Policy Example

| Time Before Check-In | Refund Amount |
| -------------------- | ------------- |
| More than 72 Hours   | 100%          |
| 24–72 Hours          | 50%           |
| Less than 24 Hours   | No Refund     |

---

# Stripe Integration

## Webhook Handling

```typescript
app.post('/api/payments/webhook', (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'payment_intent.succeeded':
      break;

    case 'payment_intent.payment_failed':
      break;

    case 'charge.refunded':
      break;
  }
});
```

Supported webhook events include:

* Payment Success
* Payment Failure
* Refund Processed
* Chargebacks
* Subscription Events (optional)

---

# Payment Reconciliation

The service supports reconciliation between:

* Stripe transactions
* Internal payment records
* Refund records
* Invoice records

Example:

```typescript
const stripePayments = await stripe.paymentIntents.list();
const dbPayments = await Payment.find({
  createdAt: { $gte: today }
});
```

---

# Security

The Payment Service includes:

1. PCI DSS compliance through Stripe.
2. Secure tokenized payment processing.
3. No storage of full card information.
4. HTTPS enforcement in production.
5. Webhook signature verification.
6. Fraud detection support via Stripe.
7. JWT-based authentication.
8. API rate limiting.
9. Audit logging for financial transactions.

---

# Testing

Run automated tests:

```bash
npm test
```

### Stripe Test Card

```text
4242 4242 4242 4242
```

---

# Deployment

## Docker

```bash
docker build -t travallee-payments:latest .

docker run \
  -p 3002:3002 \
  --env-file .env \
  travallee-payments:latest
```

---

# Related Services

* Auth Service – User authentication and authorization
* Booking Service – Reservation and booking management
* Notification Service – Payment receipts and notifications
* Hotel Service – Hotel and room information

---

# Support

For troubleshooting:

1. Verify Stripe API credentials.
2. Ensure MongoDB and Redis are running.
3. Check webhook configuration.
4. Review payment processing logs.
5. Validate notification service connectivity.
6. Verify environment variables are configured correctly.

---

# License

This service is part of the Travallee Hotel Management System.
