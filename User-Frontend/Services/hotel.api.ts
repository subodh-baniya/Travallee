import { hotelClient } from "./httpclient/hotel.client";

export const registerHotel = (data: FormData) => {
  return hotelClient
    .post("/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(res => res.data);
};

export const getHotelInfo=hotelClient.get('/my-hotel').then(res=>res.data);

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

export const getRooms = (hotelId: string, page = 1, limit = 10) => {
  return hotelClient
    .get(`/rooms/${hotelId}`, {
      params: { page, limit },
    })
    .then(res => res.data);
};