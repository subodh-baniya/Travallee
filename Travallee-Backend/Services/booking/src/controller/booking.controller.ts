
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

//@ts-ignore this is for saving otp and booking data temporarily before confirmation, it will be deleted after confirmation or expiration
const bookingRedis = new redis(connection);

//@ts-ignore this is for pub sub model 
const boookingPub = new redis(connection);

const bookingConfirmationQueue = new Queue<BookingConfirmationJobData>("bookingConfirmationOtp", {
    connection
})



const createBooking = asyncHandler(async (req: any, res: any) => {
    let validated: any;
    const userId = req.user.id;
    const { email ,Name } = req.user;


    try {
        validated = createBookingSchema.parse({ ...req.body, userId, userEmail: email, userName: Name });
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
        bookingPayment: validated.paymentMethod === "COD" ? "NOTPAID" : "PAID",
        status: validated.paymentMethod === "PENDING",
        hotelId: validated.hotelId,
        roomId: validated.roomId,
        hotelName: validated.hotelName,
        roomNumber: validated.roomNumber,
        email: validated.userEmail,
    };
    const otp = Math.floor(1000 + Math.random() * 9000);
    await bookingRedis.set(`booking_otp:${validated.userId}`, String(otp), "EX", 15 * 60);
     bookingConfirmationQueue.add("bookingConfirmationOtp", {
        email: validated.userEmail,
        userName: validated.userName,
        bookingId: "",
        hotelName: validated.hotelName,
        checkInDate: validated.checkIn,
        checkOutDate: validated.checkOut,
        roomNumber: validated.roomNumber,
        otp
    });
    
  
    await bookingRedis.set(`booking:${validated.userId}`, JSON.stringify(newBooking), "EX", 15 * 60);

    return apiResponse(res, 201, true, "Otp sent successfully", { otpSent: true, expiresIn: 15 * 60 });
}
)


const verifyBookingOtp = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;
    const name = req.user.Name;
    const { otp } = req.body;
    const storedOtp = await bookingRedis.get(`booking_otp:${userId}`);

    if (!storedOtp) {
        return apiError(res, 400, "OTP has expired. Please try booking again.");
    }
    if (Number(otp) !== Number(storedOtp)) {
        return apiError(res, 400, "Invalid OTP. Please try again.");
    }
    const bookingDataString = await bookingRedis.get(`booking:${userId}`);
    if (!bookingDataString) {
        return apiError(res, 400, "Booking data has expired. Please try booking again.");
    }
    const bookingData = JSON.parse(bookingDataString);
     if(bookingData.paymentMethod === "COD"){
        bookingData.bookingPayment = "NOTPAID";
        bookingData.status = "PENDING";
     }
    
    const newBooking = new bookingModel({
        user: userId,
        hotel: bookingData.hotelId,
        room: bookingData.roomId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: bookingData.totalPrice,
        paymentMethod: bookingData.paymentMethod,
        bookingPayment: bookingData.paymentMethod,
        status: bookingData.paymentMethod ,
        hotelName: bookingData.hotelName,
        roomNumber: bookingData.roomNumber,
        email: bookingData.email || bookingData.userEmail || req.user.email,
    });
    await newBooking.save();

    await bookingRedis.del(`booking_otp:${userId}`);
    await bookingRedis.del(`booking:${userId}`);
    await boookingPub.publish("bookingConfirmed", JSON.stringify({
        name,
        email: bookingData.userEmail,
        userName: bookingData.userName,
        bookingId: newBooking._id,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        roomNumber: bookingData.roomNumber,
        status: bookingData.status,
    }));
    return apiResponse(res, 200, true, "Booking confirmed successfully", newBooking );
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