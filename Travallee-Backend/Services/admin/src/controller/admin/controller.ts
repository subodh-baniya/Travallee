import redis from "ioredis"
import {asyncHandler} from "../../config/asynchandler.js"
import {  apiResponse } from "../../config/response/api.response.js";
import { z } from "zod";
import SubscriptionSet from "ioredis/built/SubscriptionSet.js";



const connection = {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT)
}


//@ts-ignore this is for pub sub model 
const adminPub = new redis(connection);

//@ts-ignore
const Subscriber = new redis(connection);

Subscriber.subscribe("bookingConfirmed", (message: any) => {
    const data = JSON.parse(message);
    console.log("Received booking confirmation:", data);
})



const getBookingConfirmations = asyncHandler(async (req: any, res: any) => {
    // This endpoint can be used to fetch recent booking confirmations if needed, but in this case we are using pub/sub to get real-time updates
    return apiResponse(res, 200, true, "Subscribed to booking confirmations");
})

export  {
    getBookingConfirmations
}