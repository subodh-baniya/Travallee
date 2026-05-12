//@ts-ignore
import { asyncHandler, apiError, apiResponse, roomModel, hotelModel, bookingModel } from "@packages"
import mongoose from "mongoose";
import * as crypto from "crypto";
import axios from "axios"


const taxrate = 13

const calulateTotalAmount = (roomPrice: number, checkIn: Date, checkOut: Date ,guestCount: number) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const nights = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay));
    return roomPrice * nights ;
}   

const discountAmount = (totalAmount: number, discountPercentage: number) => {
    return totalAmount * (discountPercentage / 100);
}

const taxAmount = (totalAmount: number, taxRate: number) => {
    return totalAmount * (taxRate / 100);
}   
const createBooking = asyncHandler(async (req: any, res: any) => {
    try {
        const { roomId,hotelId, checkIn, checkOut, guestCount } = req.body;

        if (!roomId || !hotelId || !checkIn || !checkOut || !guestCount) {
            return apiError(res, "All fields are required", 400);
        }

        const room = await roomModel.findById(roomId).populate("hotel");
        const hotelDiscount = await hotelModel.findById(hotelId).select("discount");
        if (!room) {
            return apiError(res, "Room not found", 404);
        }

        const hotel = await hotelModel.findById(hotelId);
        if (!hotel) {
            return apiError(res, "Hotel not found", 404);
        }

       const Checkavailability = await bookingModel.find({
            room: roomId,
            hotel: hotelId,
            status: { $in: ["PENDING", "CONFIRMED"] },
            $or: [
                { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
                { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
                { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
            ]
       })

        if (Checkavailability.length >= room.quantity) {
            return apiError(res, "Room is fully booked for the selected dates", 400);
        }   

        const totalAmount = calulateTotalAmount(room.price, new Date(checkIn), new Date(checkOut), guestCount);
        const discount = discountAmount(totalAmount, hotelDiscount.discount);
        const tax = taxAmount(totalAmount - discount, taxrate);
        const finalAmount = totalAmount - discount + tax;

        const booking = await bookingModel.create({
            user: req.user._id,
            hotel: room.hotel._id,
            room: room._id,
            checkIn: new Date(checkIn), 
            checkOut: new Date(checkOut),
            guestCount,
            totalAmount: finalAmount,
            discount,
            tax,
            bookingPayment: "PENDING",
            status: "PENDING"
        });

        return apiResponse(res, "Booking created successfully", { bookingId: booking._id });
    } catch (error: any) {
        return apiError(res, "Failed to create booking", 500);
    }
})  
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
    } catch (error: any ) {
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

export { khaltiVerify,esewaSuccess }