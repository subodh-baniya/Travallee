import apiClient from './apiClient';

interface CreateBookingPayload {
  roomId: string;
  hotelId: string;
  checkIn: string; // ISO date format: "2026-05-20"
  checkOut: string; // ISO date format: "2026-05-25"
  guestCount: number;
  paymentMethod?: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: any;
}

/**
 * Create a new booking
 */
export const createBooking = async (payload: CreateBookingPayload): Promise<BookingResponse> => {
  try {
    const response = await apiClient.post<BookingResponse>(
      'http://localhost:5002/api/v1/booking/create-booking',
      payload
    );
    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to create booking',
      status: error.response?.status,
      error,
    };
  }
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (): Promise<BookingResponse> => {
  try {
    const response = await apiClient.get<BookingResponse>(
      'http://localhost:5002/api/v1/booking'
    );
    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch bookings',
      status: error.response?.status,
      error,
    };
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId: string): Promise<BookingResponse> => {
  try {
    const response = await apiClient.get<BookingResponse>(
      `http://localhost:5002/api/v1/booking/${bookingId}`
    );
    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch booking',
      status: error.response?.status,
      error,
    };
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string): Promise<BookingResponse> => {
  try {
    const response = await apiClient.post<BookingResponse>(
      `http://localhost:5002/api/v1/booking/cancel/${bookingId}`
    );
    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to cancel booking',
      status: error.response?.status,
      error,
    };
  }
};
