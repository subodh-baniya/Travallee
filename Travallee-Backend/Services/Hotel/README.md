# 🏨 Hotel Service

The **Hotel & Room Management Service** handles hotel information, room inventory, pricing, amenities, availability, and hotel-related queries. It's the core service for hotel data management.

## 📋 Overview

Hotel Service manages:
- Hotel information and details
- Room inventory and types
- Pricing and seasonal rates
- Room amenities and features
- Hotel search and filtering
- Room availability
- Floor/wing organization
- Hotel photos and media

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Express.js 5.2 |
| **Language** | TypeScript 5.9 |
| **Database** | MongoDB + Mongoose |
| **Caching** | Redis |
| **File Storage** | Cloudinary |
| **Validation** | Zod |

---

## 📂 Project Structure

```
Hotel/
├── src/
│   ├── app.ts                      # Express app setup
│   ├── index.ts                    # Server entry point
│   ├── Controllers/                # Request handlers
│   │   ├── hotel.controller.ts     # Hotel endpoints
│   │   └── room.controller.ts      # Room endpoints
│   ├── Routes/                     # Route definitions
│   │   ├── hotel.routes.ts         # Hotel routes
│   │   └── room.routes.ts          # Room routes
│   ├── Models/                     # Data models
│   │   ├── Hotel.ts                # Hotel schema
│   │   └── Room.ts                 # Room schema
│   ├── Services/                   # Business logic
│   │   ├── hotel.service.ts        # Hotel operations
│   │   └── room.service.ts         # Room operations
│   ├── Schemas/                    # Validation schemas
│   │   ├── hotel.schema.ts         # Hotel validation
│   │   └── room.schema.ts          # Room validation
│   └── Utils/                      # Helper functions
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
cd Travallee-Backend/Services/Hotel

npm install
cp .env.example .env
```

### Environment Variables

```env
PORT=3001
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/travalee_hotel
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secret_key

CLOUDINARY_URL=cloudinary://key:secret@cloud
```

### Start Development

```bash
npm run dev
```

Runs on: **http://localhost:3001**

---

## 🔌 API Endpoints

### Hotels

#### Get All Hotels
```
GET /api/hotels
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string
  - location: string
  - minRating: number
  - maxPrice: number
```

#### Get Hotel by ID
```
GET /api/hotels/:id
```

#### Create Hotel
```
POST /api/hotels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Grand Hotel",
  "email": "contact@grandhotel.com",
  "phone": "+1234567890",
  "location": "New York, NY",
  "description": "Luxury 5-star hotel...",
  "amenities": ["wifi", "gym", "pool"],
  "checkInTime": "15:00",
  "checkOutTime": "11:00"
}
```

#### Update Hotel
```
PATCH /api/hotels/:id
Authorization: Bearer <token>
```

#### Delete Hotel
```
DELETE /api/hotels/:id
Authorization: Bearer <token>
```

#### Search Hotels
```
GET /api/hotels/search
Query Parameters:
  - location: string
  - checkIn: date
  - checkOut: date
  - guests: number
```

---

### Rooms

#### Get All Rooms
```
GET /api/rooms
Query Parameters:
  - hotelId: string
  - type: string
  - page: number
  - limit: number
```

#### Get Room by ID
```
GET /api/rooms/:id
```

#### Create Room
```
POST /api/hotels/:hotelId/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "roomNumber": "101",
  "type": "deluxe",
  "basePrice": 150,
  "capacity": 2,
  "amenities": ["wifi", "ac", "tv"],
  "description": "Spacious room with city view",
  "floor": 1
}
```

#### Update Room
```
PATCH /api/rooms/:id
Authorization: Bearer <token>
```

#### Delete Room
```
DELETE /api/rooms/:id
Authorization: Bearer <token>
```

#### Check Availability
```
GET /api/rooms/:id/availability
Query Parameters:
  - checkIn: date
  - checkOut: date
```

#### Upload Room Photos
```
POST /api/rooms/:id/photos
Authorization: Bearer <token>
Content-Type: multipart/form-data

[File upload]
```

---

## 📁 Data Models

### Hotel Model

```typescript
interface IHotel {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  amenities: string[];
  photos: string[];
  checkInTime: string;     // "15:00"
  checkOutTime: string;    // "11:00"
  rating: number;          // 0-5
  totalReviews: number;
  owner: ObjectId;         // Reference to User
  createdAt: Date;
  updatedAt: Date;
}
```

### Room Model

```typescript
interface IRoom {
  _id: ObjectId;
  hotelId: ObjectId;       // Reference to Hotel
  roomNumber: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  basePrice: number;
  capacity: number;
  amenities: string[];
  photos: string[];
  description: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔍 Search & Filtering

### Hotel Search

```typescript
// Search hotels by location and rating
GET /api/hotels?location=New York&minRating=4

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Grand Hotel",
      "location": "New York",
      "rating": 4.8
    }
  ]
}
```

### Room Availability

```typescript
// Check room availability
GET /api/rooms/:id/availability?checkIn=2024-05-20&checkOut=2024-05-25

Response:
{
  "success": true,
  "data": {
    "available": true,
    "price": 150,
    "nights": 5
  }
}
```

---

## 💾 Caching Strategy

Uses Redis for performance:

- **Hotel Cache** - Cached for 24 hours
  ```
  Key: hotel:{id}
  Value: Hotel document
  TTL: 86400 seconds
  ```

- **Room Cache** - Cached for 12 hours
  ```
  Key: room:{id}
  Value: Room document
  TTL: 43200 seconds
  ```

- **Availability Cache** - Cached for 1 hour
  ```
  Key: availability:{roomId}:{checkIn}:{checkOut}
  TTL: 3600 seconds
  ```

### Cache Invalidation

Cache invalidated when:
- Hotel updated
- Room updated
- New booking created
- Booking cancelled

---

## 📸 Photo Management

### Upload Photos

```typescript
POST /api/rooms/:id/photos
Authorization: Bearer <token>

// Uses Cloudinary for image storage
// Auto-generates thumbnails and optimized versions
```

### Photo URLs

- Original: `https://res.cloudinary.com/...`
- Thumbnail: `https://res.cloudinary.com/.../c_thumb,...`
- Optimized: `https://res.cloudinary.com/.../w_600,...`

---

## 📊 Controllers

### Hotel Controller

**File:** `src/Controllers/hotel.controller.ts`

Endpoints:
- `getAllHotels()` - List hotels with pagination
- `getHotelById()` - Get single hotel details
- `createHotel()` - Create new hotel
- `updateHotel()` - Update hotel info
- `deleteHotel()` - Delete hotel
- `searchHotels()` - Search by criteria

### Room Controller

**File:** `src/Controllers/room.controller.ts`

Endpoints:
- `getAllRooms()` - List rooms by hotel
- `getRoomById()` - Get room details
- `createRoom()` - Add room to hotel
- `updateRoom()` - Update room info
- `deleteRoom()` - Delete room
- `checkAvailability()` - Check room availability
- `uploadPhotos()` - Upload room photos

---

## 🔒 Security

- ✅ Only hotel admins can manage their hotels
- ✅ Role-based access control
- ✅ Input validation with Zod
- ✅ Rate limiting
- ✅ CORS protection
- ✅ HTTPS only in production

---

## 🧪 Testing

```bash
npm test
```

---

## 🚀 Deployment

```bash
docker build -t travallee-hotel:latest .
docker run -p 3001:3001 --env-file .env travallee-hotel:latest
```

---

## 📚 Related Services

- **Auth Service** - Hotel owner authentication
- **Booking Service** - Check room availability
- **Admin Service** - Hotel analytics

---

**Hotel Management Service of Travallee**
