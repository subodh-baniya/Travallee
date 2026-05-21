//@ts-ignore
import { asyncHandler, apiError, apiResponse, roomModel, hotelModel, bookingModel } from "@packages"
import mongoose from "mongoose";
import * as crypto from "crypto";
import axios from "axios"
import { BookingConfirmationJobData, createBookingSchema } from "../schema/bokingschems.js"
import { z } from "zod";
import {Queue} from "bullmq"
import redis from "ioredis";
//@ts-ignore
const bookingRedis = new redis(connection);

const connection = {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT)
}
const bookingConfirmationQueue = new Queue<BookingConfirmationJobData>("BookingConfirmation", {
    connection
})

const taxrate = 13

const calulateTotalAmount = (roomPrice: number, checkIn: Date, checkOut: Date, guestCount: number) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const nights = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay));
    return roomPrice * nights;
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
    const room = await roomModel.findById(roomObjectId);
    if (!room) {
        return apiError(res, 404, "Room not found");
    }

    if (room.hotelId.toString() !== hotelObjectId.toString()) {
        return apiError(res, 400, "Room does not belong to the specified hotel");
    }

    const hotel = await hotelModel.findById(hotelObjectId);
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

    const calculatedTotalAmount = calulateTotalAmount(room.pricePerNight, checkInDate, checkOutDate, validated.guests);
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

const khaltiVerify = asyncHandler(async (req: any, res: any) => {
    try {
        const { pidx, purchase_order_id } = req.query;

        if (!pidx || !purchase_order_id) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
        }

        const booking = await bookingModel.findById(purchase_order_id).populate("hotel");
        if (!booking) return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);

        const hotel = await hotelModel.findById(booking.hotel);
        if (!hotel?.khalti_SecretKey) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
        }

        const lookupRes = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
                headers: {
                    Authorization: `Key ${hotel.khalti_SecretKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const paymentStatus = lookupRes.data?.status;

        if (paymentStatus === "Completed") {
            await bookingModel.findByIdAndUpdate(
                purchase_order_id,
                { status: "CONFIRMED", bookingPayment: "PAID", khalti_pidx: pidx },
                { new: true }
            )

            return res.redirect(`${process.env.FRONTEND_URL}/payment-success?bookingId=${purchase_order_id}`);
        }

        await bookingModel.findByIdAndUpdate(purchase_order_id, { status: "CANCELLED" });
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?bookingId=${purchase_order_id}`);

    } catch (error: any) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

})

export { createBooking, khaltiVerify, esewaSuccess }