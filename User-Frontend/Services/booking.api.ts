import { bookingAdmin, bookingClient } from "./httpclient/booking.client"

export interface CreateBookingPayload {
  roomId: string;
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  paymentMethod: "COD" | "ESEWA" | "KHALTI";
  Name: string;
  email: string;
}

export const getBookingHistory = (hotelId: string) => {
    return bookingAdmin.get(`/booking-history/${hotelId}`)
}

export const getGuestStatus = (bookingId: string) => {
    return bookingAdmin.get(`/guest-status/${bookingId}`)
}

export const createBooking = (data: CreateBookingPayload) =>{
 return bookingClient
    .post("/create-booking-hotel", data)
    .then((res) => res.data);
}