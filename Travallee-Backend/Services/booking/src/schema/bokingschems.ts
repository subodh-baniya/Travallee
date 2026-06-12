import { z } from "zod";

// Schema for creating a new booking
export const createBookingSchema = z.object({
  Name: z.string().min(1, "Name is required").optional(),
  userEmail: z.string().email("Invalid email format").optional(),
  userName: z.string().min(1, "User name is required").optional(),
  hotelName: z.string().min(1, "Hotel name is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  userId: z.string().min(1, "User ID is required"),
  hotelId: z.string().min(1, "Hotel ID is required"),
  roomId: z.string().min(1, "Room ID is required"),
  guests: z.number().int().positive("Guests must be a positive number"),
  checkIn: z.string().datetime("Invalid check-in date format"),
  checkOut: z.string().datetime("Invalid check-out date format"),
  totalPrice: z.number().positive("Total price must be greater than 0"),
  status: z.enum(["CANCELLED", "PENDING", "CONFIRMED"]).optional(),
  paymentMethod: z.enum(["KHALTI", "ESEWA", "COD"]).describe("Payment method must be KHALTI, ESEWA, or COD"),
});

// Schema for updating booking status
export const updateBookingStatusSchema = z.object({
  status: z.enum(["CANCELLED", "PENDING", "CONFIRMED"]).describe("Status must be CANCELLED, PENDING, or CONFIRMED"),
});

// Schema for updating booking payment status
export const updateBookingPaymentSchema = z.object({
  bookingPayment: z.enum(["PAID", "NOTPAID"]).describe("Payment status must be PAID or NOTPAID"),
  paymentReferenceId: z.string().optional(),
  khalti_pidx: z.string().optional(),
});

// Schema for verifying payment
export const verifyPaymentSchema = z.object({
  pidx: z.string().min(1, "Payment ID (pidx) is required"),
  transactionId: z.string().min(1, "Transaction ID is required"),
  bookingId: z.string().min(1, "Booking ID is required"),
});

export interface BookingConfirmationJobData {
    email: string;
    userName: string;
    bookingId: string;
    hotelName: string;
    checkInDate: string;
    checkOutDate: string;
    roomNumber: string;
    otp: number;
}


// Type exports for TypeScript
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type UpdateBookingPaymentInput = z.infer<typeof updateBookingPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
