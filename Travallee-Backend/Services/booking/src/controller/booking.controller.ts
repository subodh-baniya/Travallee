
import {asyncHandler} from "../config/asynchandler.js"
import { apiError, apiResponse } from "../config/response/api.response.js";
import { bookingModel } from "../model/Booking.model.js"
import mongoose from "mongoose";

import axios from "axios"
import { BookingConfirmationJobData, createBookingSchema } from "../schema/bokingschems.js"
import { z } from "zod";
import {Queue} from "bullmq"
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

const taxrate = 13

const calulateTotalAmount = (roomPrice: number | undefined, checkIn: Date, checkOut: Date, guestCount: number) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const nights = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay));
    return roomPrice ? roomPrice * nights : 0;
}

const discountAmount = (totalAmount: number, discountPercentage: number) => {
    return totalAmount * (discountPercentage / 100);
}

const taxAmount = (totalAmount: number, taxRate: number) => {
    return totalAmount * (taxRate / 100);
}

const createBooking = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;
    let validated: any;

    try {
        validated = createBookingSchema.parse(req.body);
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
    const room = await axios.get(`${process.env.ROOM_SERVICE_URL}/rooms/${validated.roomId}`).then(response => response.data).catch(() => null);      
    if (!room) {
        return apiError(res, 404, "Room not found");
    }

    const hotel = await axios.get(`${process.env.HOTEL_SERVICE_URL}/hotels/${validated.hotelId}`).then(response => response.data).catch(() => null);
    if (!hotel) {
        return apiError(res, 404, "Hotel not found");
    }

    const checkInDate = new Date(validated.checkIn);
    const checkOutDate = new Date(validated.checkOut);

    const bookedDates = await bookingModel.find({
        room: roomObjectId,
        hotel: hotelObjectId,
        status: { $in: ["PENDING", "CONFIRMED"] },
        bookingPayment: "PAID",
        $or: [
            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        ]
    });

    if (bookedDates.length > 0) {
        return apiError(res, 400, "Room is not available for the selected dates");
    }

    const calculatedTotalAmount = calulateTotalAmount(room.pricePerNight as number | undefined, checkInDate, checkOutDate, validated.guests);
    const discount = discountAmount(calculatedTotalAmount, hotel.discount || 0);
    const tax = taxAmount(calculatedTotalAmount - discount, taxrate);
    const finalAmount = calculatedTotalAmount - discount + tax;

    bookingRedis.set(`booking:${userId}`, JSON.stringify({ ...validated, finalAmount }), "EX", 15 * 60);

    return apiResponse(res, 201, true, "Booking created successfully", );
}
)


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



export { createBooking, esewaSuccess }