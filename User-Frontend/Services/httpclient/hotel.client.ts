import axios from "axios"

export const hotelClient=axios.create({
    baseURL:`${import.meta.env.VITE_API_BASE_URL_HOTEL}`,
    withCredentials:true
})