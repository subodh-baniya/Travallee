import dotenv from "dotenv"
import { asyncHandler } from "../../config/asynchandler.js";
import { createClient } from "redis";
import { io } from "../../app.js";
import axios from "axios";
import { apiResponse, apiError } from "../../config/response/api.response.js";
import { PendingRegistrationModel } from "../../model/PendingRegistration.js";


dotenv.config({
    path:"./.env"
})

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME || "default",
};

const pub = createClient({
    url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

const sub = createClient({
    url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

Promise.all([pub.connect(), sub.connect()]).then(() => {

    sub.subscribe("hotelRegistrationsData", async (message: string) => {
        try {
            const data = JSON.parse(message);
    
            try {
                const pendingRegistration = new PendingRegistrationModel({
                    userID: data.userID,
                    ownerName: data.ownerName || data.contactName,
                    hotelName: data.hotelName,
                    hotelLocation: data.hotelLocation,
                    hotelDescription: data.hotelDescription,
                    contactNumber: data.contactNumber || data.phone,
                    email: data.email || data.contactEmail,
                    propertyType: data.propertyType,
                    hotelImages: data.hotelImages || [],
                    VerificationDocuments: data.VerificationDocuments || [],
                    facilities: data.facilities || [],
                    checkinTime: data.checkinTime,
                    checkoutTime: data.checkoutTime,
                    pricePerNight: data.pricePerNight,
                    starRating: data.starRating || data.rating || 0,
                    roomCount: data.rooms || 0,
                    status: "pending",
                    rawData: data,
                });
                
                await pendingRegistration.save();
                console.log(" Saved hotel registration to database:", pendingRegistration._id);
            } catch (dbErr: any) {
                console.error(" Error saving to database:", dbErr.message);
            }
            
            // Emit to all connected superadmin clients
            io.to(`superadmin`).emit("hotelRegistrationsData", data);
            console.log("📡 Emitted hotel registration data to superadmin room");
        }
        catch (err: any) {
            console.error(" Error parsing hotel registration data message:", err);
        }
    })
})
    .catch((err: any) => {
        console.error(" Error connecting to Redis in add.controller:", err);
    });

const getNewRegistration = asyncHandler(async (req: any, res: any) => {
    try {
        // Fetch pending registrations from database
        const pendingRegistrations = await PendingRegistrationModel.find({ status: "pending" })
            .sort({ createdAt: -1 });
        
        console.log(" Retrieved pending registrations from database:", pendingRegistrations.length);
        return apiResponse(
            res, 
            200, 
            true, 
            "Pending registrations retrieved successfully", 
            pendingRegistrations
        );
    } catch (err: any) {
        console.error(" Error retrieving pending registrations from database:", err);
        return apiError(res, 500, "Unable to retrieve registrations", err.message);
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
        await PendingRegistrationModel.updateOne(
            { userID },
            { 
                status: "active",
                reviewedAt: new Date(),
            }
        );
        console.log(" Updated registration status to 'active' in database:", userID);
        
        return apiResponse(res, 200, true, "Registration approved successfully", response.data?.data);
    } catch (error: any) {
        console.error(" Error approving registration:", error?.response?.data || error?.message || error);
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
        
        // Update registration status in database
        await PendingRegistrationModel.updateOne(
            { userID },
            { 
                status: "declined",
                reviewedAt: new Date(),
            }
        );
        console.log("Updated registration status to 'declined' in database:", userID);
        
        return apiResponse(res, 200, true, "Registration declined successfully", response.data?.data);
    } catch (error: any) {
        console.error(" Error declining registration:", error?.response?.data || error?.message || error);
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