import redis from "ioredis"
import {asyncHandler} from "../../config/asynchandler.js"
import {  apiResponse } from "../../config/response/api.response.js"
import { createClient } from "redis";
import { io } from "../../app.js";

const sub = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
sub.connect()

const connection = {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT)
}

sub.subscribe("bookingConfirmed",async (BookingData: string) => {
        const bookingData = JSON.parse(BookingData);
        console.log("Received booking confirmation for booking ID:", bookingData.bookingId);
        io.to(`hotel_${bookingData.hotelId}`).emit("new_booking", bookingData);
    });


//@ts-ignore this is for pub sub model 
const adminPub = new redis(connection);

const getBookingDataNOtification = asyncHandler(async (req: any, res: any) => {
   
    return apiResponse(res, 200, true, "Subscribed to booking confirmations");
});

export {
    getBookingDataNOtification
}