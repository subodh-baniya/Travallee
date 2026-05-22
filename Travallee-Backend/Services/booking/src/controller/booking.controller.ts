
import { asyncHandler } from "../config/asynchandler.js"
import { apiError, apiResponse } from "../config/response/api.response.js";
import { bookingModel } from "../model/Booking.model.js"
import mongoose from "mongoose";

import axios from "axios"
import { BookingConfirmationJobData, createBookingSchema } from "../schema/bokingschems.js"
import { z } from "zod";
import { Queue } from "bullmq"
import redis from "ioredis";



const connection = {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT)
}

//@ts-ignore
const bookingRedis = new redis(connection);
const bookingConfirmationQueue = new Queue<BookingConfirmationJobData>("BookingConfirmation", {
    connection
})

const createBooking = asyncHandler(async (req: any, res: any) => {
    let validated: any;
    console.log("Received booking request with data:", req.body);
    console.log("User data from request:", req.user);
    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name;
    const hotelName = req.body.hotelName;
    const roomNumber = req.body.roomNumber;
    const data = { userId, userEmail, userName, hotelName, roomNumber, ...req.body };

    try {
        validated = createBookingSchema.parse(data);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return apiError(res, 400, "Validation Error", formattedErrors);
        }
        return apiError(res, 400, "Invalid request data");
    }

    let roomObjectId, hotelObjectId;
    try {
        roomObjectId = new mongoose.Types.ObjectId(validated.roomId);
        hotelObjectId = new mongoose.Types.ObjectId(validated.hotelId);
    } catch (e) {
        return apiError(res, 400, "Invalid room or hotel ID format");
    }


    const bookedDates = await bookingModel.find({
        room: roomObjectId,
        hotel: hotelObjectId,
        status: { $in: ["PENDING", "CONFIRMED"] },
        bookingPayment: "PAID",
        $or: [
            { checkIn: { $lt: new Date(validated.checkOut) }, checkOut: { $gt: new Date(validated.checkIn) } }
        ]
    });

    if (bookedDates.length > 0) {
        return apiError(res, 400, "Room is not available for the selected dates");
    }

    const newBooking = {
        user: validated.userId,
        hotel: hotelObjectId,
        room: roomObjectId,
        guests: validated.guests,
        checkIn: new Date(validated.checkIn),
        checkOut: new Date(validated.checkOut),
        totalPrice: validated.totalPrice,
        paymentMethod: validated.paymentMethod,
        bookingPayment: validated.paymentMethod === "COD" ? "PAID" : "NOTPAID",
        status: validated.paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
    };
    const otp = Math.floor(100000 + Math.random() * 900000);
    await bookingRedis.set(`booking_otp:${validated.userId}`, otp, "EX", 15 * 60);
    await bookingConfirmationQueue.add("sendBookingOtp", {
        email: validated.userEmail,
        userName: validated.userName,
        bookingId: "",
        hotelName: validated.hotelName,
        checkInDate: validated.checkIn,
        checkOutDate: validated.checkOut,
        roomNumber: validated.roomNumber,
        otp
    });
    console.log("Booking data stored in Redis:", newBooking);
    console.log("OTP stored in Redis:", otp);
    console.log(`Booking OTP stored with key: booking_otp:${validated.userId}`);


    await bookingRedis.set(`booking:${validated.userId}`, JSON.stringify(newBooking), "EX", 15 * 60);

    return apiResponse(res, 201, true, "Otp sent successfully", { otp: otp * 1000 });
}
)


const verifyBookingOtp = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;
    const { otp } = req.body;
    const storedOtp = await bookingRedis.get(`booking_otp:${userId}`);

    if (!storedOtp) {
        return apiError(res, 400, "OTP has expired. Please try booking again.");
    }
    if (otp !== storedOtp) {
        return apiError(res, 400, "Invalid OTP. Please try again.");
    }
    const bookingDataString = await bookingRedis.get(`booking:${userId}`);
    if (!bookingDataString) {
        return apiError(res, 400, "Booking data has expired. Please try booking again.");
    }
    const bookingData = JSON.parse(bookingDataString);

    const newBooking = new bookingModel({
        user: userId,
        hotel: bookingData.hotelId,
        room: bookingData.roomId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests
    });
    await newBooking.save();

    await bookingRedis.del(`booking_otp:${userId}`);
    await bookingRedis.del(`booking:${userId}`);
    return apiResponse(res, 200, true, "Booking confirmed successfully", { bookingId: newBooking._id });
});



const esewaSuccess = asyncHandler(async (req: any, res: any) => {
    try {
        const { data } = req.query;
        if (!data) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
        }

        const decoded = JSON.parse(
            Buffer.from(data, "base64").toString("utf8")
        );

        const bookingId = decoded.transaction_uuid;

        const verifyResponse = await axios.get("https://rc-epay.esewa.com.np/api/epay/transaction/status/", {
            params: {
                product_code: decoded.product_code,
                total_amount: decoded.total_amount,
                transaction_uuid: bookingId
            }
        })

        if (verifyResponse.data.status == "COMPLETE") {
            await bookingModel.findByIdAndUpdate(bookingId, {
                status: "CONFIRMED",
                bookingPayment: "PAID",
                paymentReferenceId: decoded.ref_id
            });

            return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
        }

        await bookingModel.findByIdAndUpdate(bookingId, {
            status: "CANCELLED"
        })

        return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    } catch (error: any) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }
})



export { createBooking, esewaSuccess, verifyBookingOtp }