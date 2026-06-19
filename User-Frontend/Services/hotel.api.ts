import { hotelClient } from "./httpclient/hotel.client";

interface payload{
 hotelName: string;
 ownerName: string;
 contactNumber: string;
 hotelLocation: string;
 propertyType: string;
 checkinTime: string;
 checkoutTime: string;
 hotelDescription: string;
 facilities: string[];
}

export const registerHotel = (data: FormData) => {
  return hotelClient
    .post("/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(res => res.data);
};

export const getHotelInfo=()=>{return hotelClient.get('/my-hotel').then(res=>res.data); }

export const getHotelById = (hotelId: string) => {
  return hotelClient.get(`/${hotelId}?t=${new Date().getTime()}`).then(res => res.data);
};

export const createRoom = (hotelId: string, data: FormData) => {
  return hotelClient
    .post(`/room/${hotelId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(res => res.data);
};

export const deleteRoom = (  hotelId: string,roomId: string,password: string) => {
  return hotelClient
    .delete(`/room/${hotelId}/${roomId}`, {
      data: { password },
    })
    .then(res => res.data);
};

export const getRooms = (hotelId: string, page = 1, limit = 12) => {
  return hotelClient
    .get(`/rooms/${hotelId}`, {
      params: { page, limit },
    })
    .then(res => res.data);
};

export const getHotelDashboard = () => {
  return hotelClient.get("/dashboard").then(res => res.data);
};

export const getBookingHistory = (hotelId: string) => {
    return hotelClient.get(`/booking-history/${hotelId}`)
}

export const getHotelRatings = (hotelId: string) => {
    return hotelClient.get(`/ratings/${hotelId}`)
}

export const updateHotelInfo = (hotelId: string, data: payload) => {
    return hotelClient.post(`/update-hotel-info/${hotelId}`, data 
      ).then(res => res.data);
}