import { hotelClient } from "./httpclient/hotel.client";

export const getHotelRegistered=hotelClient.post('/register').then(res=>res.data);

export const getHotelInfo=hotelClient.get('getHotelInfo').then(res=>res.data);

export const createRoom = hotelClient.post ('/room/:hotelId').then(res=>res.data);

export const deleteRoom= hotelClient.delete('/room/:hotelId/:roomId').then(res=>res.data)