# 💳 Payment Service

The **Payment Processing Service** handles payment processing, invoicing, refunds, and financial transactions. It integrates with payment providers and manages the complete payment lifecycle.

## 📋 Overview

Payment Service manages:
- Payment processing (credit cards, digital wallets)
- Invoice generation
- Refund management
- Payment history and reconciliation
- Transaction tracking
- Receipt generation
- Multiple payment methods
- Payment security

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Express.js 5.2 |
| **Language** | TypeScript 5.9 |
| **Database** | MongoDB + Mongoose |
| **Caching** | Redis |
| **Payment Gateway** | Stripe (configurable) |
| **Queue** | BullMQ |

---

## 📂 Project Structure

```
payments/
├── src/
│   ├── app.ts                      # Express app setup
│   ├── index.ts                    # Server entry point
│   ├── Controllers/                # Request handlers
│   │   ├── payment.controller.ts   # Payment endpoints
│   │   ├── invoice.controller.ts   # Invoice endpoints
│   │   └── refund.controller.ts    # Refund endpoints
│   ├── Routes/                     # Route definitions
│   │   ├── payment.routes.ts
│   │   ├── invoice.routes.ts
│   │   └── refund.routes.ts
│   ├── Models/                     # Data models
│   │   ├── Payment.ts              # Payment schema
│   │   ├── Invoice.ts              # Invoice schema
│   │   └── Refund.ts               # Refund schema
│   ├── Services/                   # Business logic
│   │   ├── payment.service.ts      # Payment operations
│   │   ├── stripe.service.ts       # Stripe integration
│   │   ├── invoice.service.ts      # Invoice generation
│   │   └── refund.service.ts       # Refund handling
│   ├── Jobs/                       # Background jobs
│   │   ├── processPayment.job.ts   # Process payment
│   │   └── sendReceipt.job.ts      # Send receipt
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
cd Travallee-Backend/Services/payments

npm install
cp .env.example .env
```

### Environment Variables

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

### Start Development

```bash
npm run dev
```

Runs on: **http://localhost:3002**

---

## 🔌 API Endpoints

### Create Payment

```
POST /api/payments/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "60d5ec49c1234567890abcde",
  "amount": 750,
  "currency": "USD",
  "paymentMethodId": "pm_...",  // Stripe payment method
  "saveCard": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abce0",
    "transactionId": "txn_...",
    "status": "processing",
    "amount": 750,
    "currency": "USD"
  }
}
```

### Get Payment Details

```
GET /api/payments/:paymentId
Authorization: Bearer <token>
```

### Get Payment History

```
GET /api/payments/user/me
Authorization: Bearer <token>
Query Parameters:
  - status: completed|failed|pending
  - page: number
  - limit: number
```

### Refund Payment

```
POST /api/payments/:paymentId/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Booking cancelled by guest",
  "amount": 750  // Optional: partial refund
}
```

### Confirm Payment

```
POST /api/payments/:paymentId/confirm
Authorization: Bearer <token>
```

---

### Invoices

#### Generate Invoice

```
POST /api/invoices/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentId": "60d5ec49c1234567890abce0",
  "bookingId": "60d5ec49c1234567890abcde"
}
```

#### Get Invoice

```
GET /api/invoices/:invoiceId
Authorization: Bearer <token>
```

#### Download Invoice PDF

```
GET /api/invoices/:invoiceId/download
Authorization: Bearer <token>
```

---

### Refunds

#### Get Refund Status

```
GET /api/refunds/:refundId
Authorization: Bearer <token>
```

#### List User Refunds

```
GET /api/refunds/user/me
Authorization: Bearer <token>
```

---

## 📁 Data Models

### Payment Model

```typescript
interface IPayment {
  _id: ObjectId;
  bookingId: ObjectId;              // Associated booking
  userId: ObjectId;                 // Payer (User)
  hotelId: ObjectId;                // Hotel
  transactionId: string;            // Payment provider ID (Stripe)
  amount: number;
  currency: string;                 // USD, EUR, etc.
  paymentMethod: {
    type: 'card' | 'wallet' | 'bank_transfer';
    last4?: string;                 // Last 4 digits if card
    brand?: string;                 // visa, mastercard, etc.
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  failureReason?: string;
  metadata: object;
  createdAt: Date;
  updatedAt: Date;
}
```

### Invoice Model

```typescript
interface IInvoice {
  _id: ObjectId;
  invoiceNumber: string;            // Unique invoice ID
  paymentId: ObjectId;              // Associated payment
  bookingId: ObjectId;              // Associated booking
  userId: ObjectId;                 // Customer
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

### Refund Model

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

## 💳 Payment Methods

### Supported Methods
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Digital Wallets (Apple Pay, Google Pay)
- Bank Transfers
- Saved Cards (stored securely)

### Save Payment Method
```typescript
// Users can save cards for future bookings
{
  "saveCard": true,
  "paymentMethodId": "pm_..."
}
```

---

## 💰 Invoice Details

### Invoice Structure

```
INVOICE #INV-2024-0001

From:
Hotel Name
Hotel Email

To:
Guest Name
Guest Email

Items:
Room Night 1          $150
Room Night 2          $150
Room Night 3          $150
Room Night 4          $150
Room Night 5          $150
                ___________
Subtotal              $750
Tax (10%)             $75
                ___________
Total                 $825

Payment Method: Visa ending in 4242
Transaction ID: txn_...
Date Issued: 2024-05-20
```

---

## 🔄 Refund Process

### Automatic Refund (Cancellation)
```
1. Booking cancelled
2. Refund initiated automatically
3. Refund processed to original payment method
4. 3-5 business days processing time
5. Refund confirmation sent to guest
```

### Manual Refund
```
1. Hotel admin initiates refund
2. Refund amount verified
3. Refund processed
4. Guest receives refund confirmation
```

### Refund Policies
```
- Full refund: 24 hours before check-in
- 50% refund: 24-72 hours before check-in
- No refund: Less than 24 hours before check-in
```

---

## 🔐 Security

- ✅ PCI DSS compliant (Stripe handles cards)
- ✅ Never store full card numbers
- ✅ HTTPS only
- ✅ Payment tokens/IDs instead of card data
- ✅ Webhook signature verification
- ✅ Rate limiting on payment endpoints
- ✅ Fraud detection via Stripe

---

## 🔄 Stripe Integration

### Webhook Handling

```typescript
// Stripe webhooks for payment status updates
app.post('/api/payments/webhook', (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update payment status to 'completed'
      break;
    case 'payment_intent.payment_failed':
      // Update payment status to 'failed'
      break;
    case 'charge.refunded':
      // Process refund
      break;
  }
});
```

---

## 📊 Payment Reconciliation

### Daily Reconciliation
```typescript
// Check Stripe payments vs Database records
const stripePayments = await stripe.paymentIntents.list();
const dbPayments = await Payment.find({ 
  createdAt: { $gte: today }
});

// Reconcile differences
```

---

## 🧪 Testing

```bash
npm test
```

### Test Mode (Stripe)
Use test card: `4242 4242 4242 4242`

---

## 🚀 Deployment

```bash
docker build -t travallee-payments:latest .
docker run -p 3002:3002 --env-file .env travallee-payments:latest
```

---

## 📚 Related Services

- **Booking Service** - Booking data
- **Notification Service** - Send receipts
- **Auth Service** - User authentication

---

## 🔗 Stripe Integration Guide

- [Stripe Documentation](https://stripe.com/docs)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Webhooks](https://stripe.com/docs/webhooks)

---

**Payment Service of Travallee**
