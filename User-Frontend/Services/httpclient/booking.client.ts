import axios from "axios"

export const bookingAdmin=axios.create({
    baseURL:`${import.meta.env.VITE_API_BASE_URL_BOOKING_DETAILS_FROM_ADMIN}`,
    withCredentials:true
})