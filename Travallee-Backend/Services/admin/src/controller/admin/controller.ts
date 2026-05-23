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
    console.log("Admin Redis clients connected");
}).catch((err) => {
    console.error("Error connecting to Redis:", err);
});

const connection = {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT)
}
// @ts-ignore this is for pub sub model
const adminPub = new redis(connection);

const getBookingData = asyncHandler(async (req: any, res: any) => {
    const { bookingId } = req.params;
    if (!bookingId) {
        return apiError(res, 400, "Booking ID is required");
    }
    try {
        const cachedBooking = await adminPub.get(`booking_${bookingId}`);
        if (cachedBooking) {
            return apiResponse(res, 200, true, "Booking retrieved successfully", JSON.parse(cachedBooking));
        }

        return apiError(res, 404, "Booking not found", { bookingId });
    } catch (error: any) {
        console.error("Error retrieving booking:", error);
        return apiError(res, 500, "Unable to retrieve booking");
    }
});

const getBookingHistoryByHotelId = asyncHandler(async (req: any, res: any) => {
    const { hotelId } = req.params;

    if (!hotelId) {
        return apiError(res, 400, "Hotel ID is required");
    }

    try {
        const hotelServiceUrl = process.env.HOTEL_SERVICE_URL || "http://hotel:3001/api/v1/hotels";
        const response = await axios.get(`${hotelServiceUrl}/booking-history/${hotelId}`);

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

export {
    getBookingData,
    getBookingHistoryByHotelId,
}