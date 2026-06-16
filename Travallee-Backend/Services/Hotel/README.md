# Hotel Service

The **Hotel Service** is responsible for managing hotel information, room inventory, pricing, amenities, availability, and hotel-related operations. It serves as the central service for hotel and room data management within the Travallee platform.

## Overview

The Hotel Service manages:

* Hotel information and details
* Room inventory and room types
* Pricing and seasonal rates
* Room amenities and features
* Hotel search and filtering
* Room availability
* Floor and wing organization
* Hotel photos and media management

---

## Technology Stack

| Component        | Technology         |
| ---------------- | ------------------ |
| **Framework**    | Express.js 5.2     |
| **Language**     | TypeScript 5.9     |
| **Database**     | MongoDB + Mongoose |
| **Caching**      | Redis              |
| **File Storage** | Cloudinary         |
| **Validation**   | Zod                |

---

## Project Structure

```text
Hotel/
├── src/
│   ├── app.ts                      # Express application setup
│   ├── index.ts                    # Server entry point
│   ├── Controllers/
│   │   ├── hotel.controller.ts     # Hotel endpoints
│   │   └── room.controller.ts      # Room endpoints
│   ├── Routes/
│   │   ├── hotel.routes.ts         # Hotel routes
│   │   └── room.routes.ts          # Room routes
│   ├── Models/
│   │   ├── Hotel.ts                # Hotel schema
│   │   └── Room.ts                 # Room schema
│   ├── Services/
│   │   ├── hotel.service.ts        # Hotel operations
│   │   └── room.service.ts         # Room operations
│   ├── Schemas/
│   │   ├── hotel.schema.ts         # Hotel validation
│   │   └── room.schema.ts          # Room validation
│   └── Utils/
│       └── ...
│
├── .env.example                    # Environment variables template
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── Dockerfile                      # Docker configuration
└── README.md                       # Documentation
```

---

## Getting Started

### Prerequisites

* Node.js 18 or later
* MongoDB
* Redis
* Cloudinary account

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

### Start Development Server

```bash
npm run dev
```

The service runs on:

```text
http://localhost:3001
```

---

## API Endpoints

### Hotel Endpoints

#### Get All Hotels

```http
GET /api/hotels
```

Query Parameters:

| Parameter | Type   | Description        |
| --------- | ------ | ------------------ |
| page      | number | Page number        |
| limit     | number | Results per page   |
| search    | string | Search keyword     |
| location  | string | Hotel location     |
| minRating | number | Minimum rating     |
| maxPrice  | number | Maximum room price |

#### Get Hotel by ID

```http
GET /api/hotels/:id
```

#### Create Hotel

```http
POST /api/hotels
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Grand Hotel",
  "email": "contact@grandhotel.com",
  "phone": "+1234567890",
  "location": "New York, NY",
  "description": "Luxury 5-star hotel",
  "amenities": ["wifi", "gym", "pool"],
  "checkInTime": "15:00",
  "checkOutTime": "11:00"
}
```

#### Update Hotel

```http
PATCH /api/hotels/:id
Authorization: Bearer <token>
```

#### Delete Hotel

```http
DELETE /api/hotels/:id
Authorization: Bearer <token>
```

#### Search Hotels

```http
GET /api/hotels/search
```

Query Parameters:

| Parameter | Type   |
| --------- | ------ |
| location  | string |
| checkIn   | date   |
| checkOut  | date   |
| guests    | number |

---

### Room Endpoints

#### Get All Rooms

```http
GET /api/rooms
```

Query Parameters:

| Parameter | Type   |
| --------- | ------ |
| hotelId   | string |
| type      | string |
| page      | number |
| limit     | number |

#### Get Room by ID

```http
GET /api/rooms/:id
```

#### Create Room

```http
POST /api/hotels/:hotelId/rooms
Authorization: Bearer <token>
Content-Type: application/json
```

```json
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

```http
PATCH /api/rooms/:id
Authorization: Bearer <token>
```

#### Delete Room

```http
DELETE /api/rooms/:id
Authorization: Bearer <token>
```

#### Check Availability

```http
GET /api/rooms/:id/availability
```

Query Parameters:

| Parameter | Type |
| --------- | ---- |
| checkIn   | date |
| checkOut  | date |

#### Upload Room Photos

```http
POST /api/rooms/:id/photos
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

---

## Data Models

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
  checkInTime: string;
  checkOutTime: string;
  rating: number;
  totalReviews: number;
  owner: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Room Model

```typescript
interface IRoom {
  _id: ObjectId;
  hotelId: ObjectId;
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

## Search and Filtering

### Hotel Search Example

```http
GET /api/hotels?location=New York&minRating=4
```

Response:

```json
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

### Room Availability Example

```http
GET /api/rooms/:id/availability?checkIn=2024-05-20&checkOut=2024-05-25
```

Response:

```json
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

## Caching Strategy

Redis is used to improve performance and reduce database load.

### Hotel Cache

```text
Key: hotel:{id}
Value: Hotel document
TTL: 86400 seconds (24 hours)
```

### Room Cache

```text
Key: room:{id}
Value: Room document
TTL: 43200 seconds (12 hours)
```

### Availability Cache

```text
Key: availability:{roomId}:{checkIn}:{checkOut}
TTL: 3600 seconds (1 hour)
```

### Cache Invalidation

Cache is automatically cleared when:

1. A hotel is updated.
2. A room is updated.
3. A new booking is created.
4. A booking is cancelled.

---

## Photo Management

### Upload Photos

```http
POST /api/rooms/:id/photos
Authorization: Bearer <token>
```

Features:

* Cloudinary image storage
* Automatic image optimization
* Thumbnail generation
* CDN delivery

### Generated Image Variants

| Type      | Description           |
| --------- | --------------------- |
| Original  | Full-resolution image |
| Thumbnail | Small preview image   |
| Optimized | Web-optimized version |

---

## Controllers

### Hotel Controller

**File:** `src/Controllers/hotel.controller.ts`

Responsibilities:

* Retrieve hotels with pagination
* Retrieve hotel details
* Create hotels
* Update hotel information
* Delete hotels
* Search hotels

### Room Controller

**File:** `src/Controllers/room.controller.ts`

Responsibilities:

* Retrieve rooms
* Retrieve room details
* Create rooms
* Update room information
* Delete rooms
* Check room availability
* Upload room photos

---

## Security

The service includes:

1. Role-based access control (RBAC)
2. Hotel owner authorization
3. Input validation using Zod
4. Rate limiting
5. CORS protection
6. HTTPS enforcement in production
7. Secure JWT authentication

---

## Testing

Run tests using:

```bash
npm test
```

---

## Deployment

### Docker Build

```bash
docker build -t travallee-hotel:latest .
```

### Docker Run

```bash
docker run -p 3001:3001 --env-file .env travallee-hotel:latest
```

---

## Related Services

* Auth Service — Hotel owner authentication and authorization
* Booking Service — Room reservations and availability
* Admin Service — Analytics and management operations

---

## Contributing

1. Follow TypeScript best practices.
2. Add validation for new endpoints.
3. Include tests for new features.
4. Update documentation when APIs change.
5. Follow established project architecture.

---

## Support

For troubleshooting:

1. Verify MongoDB connectivity.
2. Verify Redis connectivity.
3. Check Cloudinary configuration.
4. Review application logs.
5. Confirm environment variables are correctly configured.

---

**Hotel Management Service for the Travallee Hotel Management System**
