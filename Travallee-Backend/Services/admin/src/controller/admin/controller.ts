import axios from "axios";
import redis from "ioredis";
import { asyncHandler } from "../../config/asynchandler.js";
import { apiResponse, apiError } from "../../config/response/api.response.js";
import { createClient } from "redis";
import { io } from "../../app.js";

const sub = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
const pub = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
Promise.all([sub.connect(), pub.connect()]).then(() => {
}).catch((err) => {
    console.error("Error connecting to Redis:", err);
});

const connection = {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT)
}
// @ts-ignore this is for pub sub model
const adminData = new redis(connection);


sub.subscribe("bookingConfirmed", async (message) => {
    try {
        const data = JSON.parse(message);
        const hotelId = data.hotelId;
        if (hotelId) {
            await adminData.del(`booking_history_${hotelId}`);
        }
        io.to(`hotel_${hotelId}`).emit("bookingConfirmed", data);
    } catch (err: any) {
        console.error("Error parsing booking confirmation message:", err);
    }
});



const getBookingHistoryByHotelId = asyncHandler(async (req: any, res: any) => {
    const { hotelId } = req.params;
    if (!hotelId) {
        return apiError(res, 400, "Hotel ID is required");
    }
    try {
        const cachedData = await adminData.get(`booking_history_${hotelId}`);
        if (cachedData) {
            return apiResponse(
                res,
                200,
                true,
                "Booking history retrieved successfully (from cache)",
                JSON.parse(cachedData),
            );
        }
    } catch (error) {
        console.error("Error accessing Redis cache:", error);
    }

    try {
        const hotelServiceUrl = process.env.HOTEL_SERVICE_URL || "http://hotel:3001/api/v1/hotels";
        const response = await axios.get(`${hotelServiceUrl}/booking-history/${hotelId}`);
        adminData.set(`booking_history_${hotelId}`, JSON.stringify(response.data?.data ?? response.data), "EX", 60 * 60 * 24 * 5);

        return apiResponse(
            res,
            200,
            true,
            "Booking history retrieved successfully",
            response.data?.data ?? response.data,
        );


    } catch (error: any) {
        console.error("Error fetching booking history from Hotel service:", error?.response?.data || error?.message || error);
        return apiError(
            res,
            error?.response?.status || 500,
            error?.response?.data?.message || "Unable to retrieve booking history",
            error?.response?.data?.error || error?.message,
        );
    }
});

const getGuestStatus = asyncHandler(async (req: any, res: any) => {
    const { hotelId } = req.params;
    console.log("Received request for guest status with hotelId:", hotelId);
    if (!hotelId) {
        return apiError(res, 400, "Hotel ID is required");
    }

    try {
        const bookingServiceUrl = process.env.BOOKING_SERVICE_URL;;
        const response = await axios.get(`${bookingServiceUrl}/guest-status/${hotelId}`);
        console.log("Guest status response from Booking service:", response.data.data ?? response.data);
        return apiResponse(
            res,
            200,
            true,
            "Guest status retrieved successfully",
            response.data?.data ?? response.data,
        );
    } catch (error: any) {
        console.error("Error fetching guest status from Booking service:", error?.response?.data || error?.message || error);
        return apiError(
            res,
            error?.response?.status || 500,
            error?.response?.data?.message || "Unable to retrieve guest status",
            error?.response?.data?.error || error?.message,
        );
    }
});


const displayGuest = asyncHandler(async (req: any, res: any) => {
});

export {
    getBookingHistoryByHotelId,
    getGuestStatus
}