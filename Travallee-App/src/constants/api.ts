import { API_URL } from "./env";

interface ApiEndpoints {
  [key: string]: string;
}
// for auth service
const API_AUTH = `${API_URL}:3000/api/v1/users`;
const API_ENDPOINTS_AUTH: ApiEndpoints = {
  LOGIN: `${API_AUTH}/login`,
  LOGOUT: `${API_AUTH}/logout`,
  REGISTER: `${API_AUTH}/register`,
  PROFILE: `${API_AUTH}/profile`,
  USER_PROFILE: `${API_AUTH}/profile-picture`,
  UPDATE_PROFILE: `${API_AUTH}/update-profile`,
  CHANGE_PASSWORD: `${API_AUTH}/change-password`,
  VERIFY_OTP: `${API_AUTH}/verify-otp`,
  SEND_OTP: `${API_AUTH}/send-otp`,
};





// for hotel service
const API_HOTEL = `${API_URL}:3001/api/v1/hotels`;

const API_ENDPOINTS_HOTEL: ApiEndpoints = {
  GET_HOTELS: `${API_HOTEL}`,
  FEATURED_HOTELS: `${API_HOTEL}/featured`,
  GET_HOTEL_BY_ID: `${API_HOTEL}/:id`,
  GET_ROOMS: `${API_HOTEL}/:hotelId/rooms`,
};





// for booking service
const API_BOOKING = `${API_URL}/api/booking`;

const API_ENDPOINTS_BOOKING: ApiEndpoints = {
  GET_BOOKINGS: `${API_BOOKING}`,
  GET_BOOKING_BY_ID: `${API_BOOKING}/:id`,
  CREATE_BOOKING: `${API_BOOKING}/create`,
  CANCEL_BOOKING: `${API_BOOKING}/cancel/:id`,
};



// for payment service
const API_PAYMENT = `${API_URL}/api/payment`;

const API_ENDPOINTS_PAYMENT: ApiEndpoints = {
  PROCESS_PAYMENT: `${API_PAYMENT}/process`,
  GET_PAYMENT_STATUS: `${API_PAYMENT}/status/:id`,
  REFUND: `${API_PAYMENT}/refund/:id`,
};

const API_NOTIFICATIONS = `${API_URL}/api/notifications`;

const API_ENDPOINTS_NOTIFICATIONS: ApiEndpoints = {
  GET_NOTIFICATIONS: `${API_NOTIFICATIONS}`,
  MARK_AS_READ: `${API_NOTIFICATIONS}/read/:id`,
  DELETE_NOTIFICATION: `${API_NOTIFICATIONS}/delete/:id`,
};

const API_CONTENT = `${API_URL}:3000/api/v1/content`;

const API_ENDPOINTS_CONTENT: ApiEndpoints = {
  ONBOARDING: `${API_CONTENT}/onboarding`,
};
export {
  API_ENDPOINTS_AUTH,
  API_ENDPOINTS_HOTEL,
  API_ENDPOINTS_BOOKING,
  API_ENDPOINTS_PAYMENT,
  API_ENDPOINTS_NOTIFICATIONS,
  API_ENDPOINTS_CONTENT,
};