import zod from 'zod';
import mongoose from 'mongoose';
import { is } from 'zod/locales';

export const createHotelSchema = zod.object({
  userID: zod.string().min(1, 'User ID is required'),
  ownerName: zod.string().min(1, 'Owner name is required'),
  hotelDescription: zod.string().min(1, 'Hotel description is required'),
  hotelLocation: zod.string().min(1, 'Hotel location is required'),
  hotelName: zod.string().min(1, 'Hotel name is required'),
  hotelImages: zod.union([
    zod.array(zod.string()).min(1, 'At least one hotel image is required'),
    zod.string().transform(str => (typeof str === 'string' && str.length > 0 ? str.split(',').map(s => s.trim()) : []))
  ]).pipe(zod.array(zod.string()).min(1, 'At least one hotel image is required')),
  propertyType: zod.string().min(1, 'Property type is required'),
  verified: zod.union([zod.boolean(), zod.string().transform(str => str === 'true')]).default(false),
  VerificationDocuments: zod.union([
    zod.array(zod.string()).min(1, 'At least one verification document is required'),
    zod.string().transform(str => (typeof str === 'string' && str.length > 0 ? str.split(',').map(s => s.trim()) : []))
  ]).pipe(zod.array(zod.string()).min(1, 'At least one verification document is required')),
  contactNumber: zod.string().regex(/^\d{10,}$/, 'Valid contact number (10+ digits) is required'),
  isactive: zod.union([zod.boolean(), zod.string().transform(str => str === 'true')]).default(false),
  facilities: zod.union([
    zod.array(zod.string()).min(1, 'At least one facility is required'),
    zod.string().transform(str => (typeof str === 'string' && str.length > 0 ? str.split(',').map(s => s.trim()) : []))
  ]).pipe(zod.array(zod.string()).min(1, 'At least one facility is required')),
  checkinTime: zod.string().min(1, 'Check-in time is required'),
  checkoutTime: zod.string().min(1, 'Check-out time is required'),
  pricePerNight: zod.coerce.number().positive('Price per night must be greater than 0'),
  rating: zod.coerce.number().min(0).max(5).default(0),
  numberOfReviews: zod.coerce.number().min(0).default(0),
  isFeatured: zod.union([zod.boolean(), zod.string().transform(str => str === 'true')]).default(false),
  roomIDs: zod.array(zod.string()).optional(),
});

export const createRoomSchema = zod.object({
  hotelId: zod.string().min(1, 'Hotel ID is required'),
  // Basic Info
  roomNumber: zod.string().min(1, 'Room number is required'),
  roomType: zod.string().min(1, 'Room type is required'),
  suitetype: zod.string().min(1, 'Suite type is required'),
  roomDescription: zod.string().min(1, 'Room description is required'),
  
  // Capacity & Physical Details
  maxOccupancy: zod.number().min(1, 'Max occupancy must be at least 1'),
  capacity: zod.number().positive('Room capacity must be greater than 0'),
  roomSize: zod.number().positive('Room size must be greater than 0').optional(),
  bedType: zod.string().min(1, 'Bed type is required'),
  floorNumber: zod.number().min(0, 'Floor number cannot be negative'),
  viewType: zod.enum(['city', 'garden', 'beach', 'mountain', 'street', 'pool', 'none']).default('none'),
  
  // Pricing
  basePrice: zod.number().positive('Base price must be greater than 0'),
  pricePerNight: zod.number().positive('Price per night must be greater than 0'),
  weekendPrice: zod.number().positive('Weekend price must be greater than 0').optional(),
  taxRate: zod.number().min(0).max(100).default(0),
  
  // Policies
  minStayNights: zod.number().min(1).default(1),
  cancellationPolicy: zod.string().min(1, 'Cancellation policy is required'),
  
  // Amenities & Features
  amenities: zod.array(zod.string()).min(1, 'At least one amenity is required'),
  specialFeatures: zod.array(zod.string()).optional(),
  roomImages: zod.array(zod.string()).min(1, 'At least one room image is required'),
  
  // Room Facilities
  isAccessible: zod.boolean().default(false),
  hasBathtub: zod.boolean().default(false),
  hasShower: zod.boolean().default(false),
  hasBalcony: zod.boolean().default(false),
  hasAC: zod.boolean().default(true),
  hasHeating: zod.boolean().default(false),
  hasWifi: zod.boolean().default(true),
  
  // Status & Ratings
  isActive: zod.boolean().default(true),
  isFeatured: zod.boolean().default(false),
  rating: zod.number().min(0).max(5).default(0),
  numberOfReviews: zod.number().min(0).default(0),
  
  // Additional
  createdAt: zod.date().optional(),
  updatedAt: zod.date().optional(),
});

export type HotelInput = zod.infer<typeof createHotelSchema>;
export type RoomInput = zod.infer<typeof createRoomSchema>;