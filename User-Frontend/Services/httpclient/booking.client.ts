import axios from "axios"

export const bookingClient=axios.create({
    baseURL:`${import.meta.env.VITE_API_BASE_URL_BOOKING}`,
    withCredentials:true
})