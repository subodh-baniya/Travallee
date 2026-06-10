import { asyncHandler } from "../../config/asynchandler.js";
import { createClient } from "redis";
import { io } from "../../app.js";
import axios from "axios";
import { apiResponse, apiError } from "../../config/response/api.response.js";

const connection = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
}

const pub = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

const sub = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

Promise.all([pub.connect(), sub.connect()]).then(() => {
    console.log("Connected to Redis in add.controller");

    sub.subscribe("hotelRegistrationsData", async (message: string) => {
        try {
            const data = JSON.parse(message);
            console.log("Received hotel registration data:", data);
            io.to(`superadmin`).emit("hotelRegistrationsData", data);
            console.log("Received message on hotelRegistrationsData channel:", message);
        }
        catch (err: any) {
            console.error("Error parsing hotel registration data message:", err);
        }
    })
})
    .catch((err: any) => {
        console.error("Error connecting to Redis in add.controller:", err);
    });

const getNewRegistration = asyncHandler(async (req: any, res: any) => {
    try {
        const keys = await pub.keys("hotel_registration_*");
        const registrations: any[] = [];
        for (const key of keys) {
            const data = await pub.get(key);
            if (data) {
                registrations.push(JSON.parse(data));
            }
        }
        return apiResponse(res, 200, true, "Pending registrations retrieved successfully", registrations);
    } catch (err: any) {
        console.error("Error retrieving pending registrations from Redis:", err);
        return apiError(res, 500, "Unable to retrieve registrations");
    }
});

const approveRegistration = asyncHandler(async (req: any, res: any) => {
    const { userID } = req.params;
    if (!userID) {
        return apiError(res, 400, "User ID is required");
    }
    try {
        const hotelServiceUrl = process.env.HOTEL_SERVICE_URL || "http://hotel:3001/api/v1/hotels";
        const response = await axios.post(`${hotelServiceUrl}/approve-registration`, { userID });
        return apiResponse(res, 200, true, "Registration approved successfully", response.data?.data);
    } catch (error: any) {
        console.error("Error approving registration:", error?.response?.data || error?.message || error);
        return apiError(
            res,
            error?.response?.status || 500,
            error?.response?.data?.message || "Failed to approve registration",
            error?.response?.data?.error || error?.message
        );
    }
});

const declineRegistration = asyncHandler(async (req: any, res: any) => {
    const { userID } = req.params;
    if (!userID) {
        return apiError(res, 400, "User ID is required");
    }
    try {
        const hotelServiceUrl = process.env.HOTEL_SERVICE_URL || "http://hotel:3001/api/v1/hotels";
        const response = await axios.post(`${hotelServiceUrl}/decline-registration`, { userID });
        return apiResponse(res, 200, true, "Registration declined successfully", response.data?.data);
    } catch (error: any) {
        console.error("Error declining registration:", error?.response?.data || error?.message || error);
        return apiError(
            res,
            error?.response?.status || 500,
            error?.response?.data?.message || "Failed to decline registration",
            error?.response?.data?.error || error?.message
        );
    }
});

export {
    getNewRegistration,
    approveRegistration,
    declineRegistration
};