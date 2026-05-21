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
          const { roomId, hotelId, checkIn, checkOut, guestCount, paymentMethod } = req.body;

        // Validation
        if (!roomId || !hotelId || !checkIn || !checkOut || !guestCount || !paymentMethod) {
            return apiError(res, 400, "All fields are required");
        }

        // Parse and validate IDs
        let roomObjectId, hotelObjectId;
        try {
            roomObjectId = new mongoose.Types.ObjectId(roomId);
            hotelObjectId = new mongoose.Types.ObjectId(hotelId);
        } catch (e) {
            return apiError(res, 400, "Invalid room or hotel ID format");
        }

        // Fetch room and validate
        const room = await roomModel.findById(roomObjectId);
        if (!room) {
            return apiError(res, 404, "Room not found");
        }

        // Verify room belongs to specified hotel
        if (room.hotelId.toString() !== hotelObjectId.toString()) {
            return apiError(res, 400, "Room does not belong to the specified hotel");
        }

        // Fetch hotel
        const hotel = await hotelModel.findById(hotelObjectId);
        if (!hotel) {
            return apiError(res, 404, "Hotel not found");
        }

        // Check availability
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
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

        // Calculate pricing
        const totalAmount = calulateTotalAmount(room.pricePerNight, checkInDate, checkOutDate, guestCount);
        const discount = discountAmount(totalAmount, hotel.discount || 0);
        const tax = taxAmount(totalAmount - discount, taxrate);
        const finalAmount = totalAmount - discount + tax;

      
        const booking = await bookingModel.create({
            user: req.user._id,
            hotel: hotelObjectId,
            room: roomObjectId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guestCount,
            totalPrice: finalAmount,
            bookingPayment: "NOTPAID",
            paymentMethod: paymentMethod,
            status: "PENDING"
        });

        return apiResponse(res, 201, true, "Booking created successfully",booking);
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

export { createBooking,khaltiVerify,esewaSuccess }