import { bookingAdmin, bookingClient } from "./httpclient/booking.client"

export const getBookingHistory = (hotelId: string) => {
    return bookingAdmin.get(`/booking-history/${hotelId}`)
}

export const getGuestStatus = (bookingId: string) => {
    return bookingAdmin.get(`/guest-status/${bookingId}`)
}

export const createBooking=()=>{
    return bookingClient.post(``)
}