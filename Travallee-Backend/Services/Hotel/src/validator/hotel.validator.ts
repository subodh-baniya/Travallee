import { z } from 'zod';

export const createHotelSchema = z.object({
  userID: z.string().min(1, 'User ID is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  hotelDescription: z.string().min(1, 'Hotel description is required'),
  hotelLocation: z.string().min(1, 'Hotel location is required'),
  hotelName: z.string().min(1, 'Hotel name is required'),
  hotelImages: z.union([
    z.array(z.string()).min(1, 'At least one hotel image is required'),
    z.string().transform((val: unknown) => (typeof val === 'string' && val.length > 0 ? val.split(',').map(s => s.trim()) : []))
  ]).pipe(z.array(z.string()).min(1, 'At least one hotel image is required')),
  propertyType: z.string().min(1, 'Property type is required'),
  verified: z.union([z.boolean(), z.string().transform((val: unknown) => (typeof val === 'string' ? val === 'true' : Boolean(val)))]).default(false),
  VerificationDocuments: z.union([
    z.array(z.string()).min(1, 'At least one verification document is required'),
    z.string().transform((val: unknown) => (typeof val === 'string' && val.length > 0 ? val.split(',').map(s => s.trim()) : []))
  ]).pipe(z.array(z.string()).min(1, 'At least one verification document is required')),
  contactNumber: z.string().regex(/^\d{10,}$/, 'Valid contact number (10+ digits) is required'),
  isactive: z.union([z.boolean(), z.string().transform((val: unknown) => (typeof val === 'string' ? val === 'true' : Boolean(val)))]).default(false),
  facilities: z.union([
    z.array(z.string()).min(1, 'At least one facility is required'),
    z.string().transform((val: unknown) => (typeof val === 'string' && val.length > 0 ? val.split(',').map(s => s.trim()) : []))
  ]).pipe(z.array(z.string()).min(1, 'At least one facility is required')),
  checkinTime: z.string().min(1, 'Check-in time is required'),
  checkoutTime: z.string().min(1, 'Check-out time is required'),
  pricePerNight: z.coerce.number().positive('Price per night must be greater than 0'),
  rating: z.coerce.number().min(0).max(5).default(0),
  numberOfReviews: z.coerce.number().min(0).default(0),
  isFeatured: z.union([z.boolean(), z.string().transform((val: unknown) => (typeof val === 'string' ? val === 'true' : Boolean(val)))]).default(false),
  roomIDs: z.array(z.string()).optional(),
});

export const createRoomSchema = z.object({
  hotelId: z.string().min(1, 'Hotel ID is required'),
  // Basic Info
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.string().min(1, 'Room type is required'),
  suitetype: z.string().min(1, 'Suite type is required'),
  roomDescription: z.string().min(1, 'Room description is required'),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]).default("AVAILABLE"),
  
  // Capacity & Physical Details
  maxOccupancy: z.number().min(1, 'Max occupancy must be at least 1'),
  capacity: z.number().positive('Room capacity must be greater than 0'),
  roomSize: z.number().positive('Room size must be greater than 0').optional(),
  bedType: z.string().min(1, 'Bed type is required'),
  floorNumber: z.number().min(0, 'Floor number cannot be negative'),
  viewType: z.enum(['city', 'garden', 'beach', 'mountain', 'street', 'pool', 'none']).default('none'),
  
  // Pricing
  basePrice: z.number().positive('Base price must be greater than 0'),
  pricePerNight: z.number().positive('Price per night must be greater than 0'),
  weekendPrice: z.number().positive('Weekend price must be greater than 0').optional(),
  taxRate: z.number().min(0).max(100).default(0),
  discount: z.number().min(0).max(100).default(0),
  
  // Policies
  minStayNights: z.number().min(1).default(1),
  cancellationPolicy: z.string().min(1, 'Cancellation policy is required'),
  
  // Amenities & Features
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  specialFeatures: z.array(z.string()).optional(),
  roomImages: z.array(z.string()).min(1, 'At least one room image is required'),
  
  // Room Facilities
  isAccessible: z.boolean().default(false),
  hasBathtub: z.boolean().default(false),
  hasShower: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  hasAC: z.boolean().default(true),
  hasHeating: z.boolean().default(false),
  hasWifi: z.boolean().default(true),
  
  // Status & Ratings
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  numberOfReviews: z.number().min(0).default(0),
  
  // Additional
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type HotelInput = z.infer<typeof createHotelSchema>;
export type RoomInput = z.infer<typeof createRoomSchema>;