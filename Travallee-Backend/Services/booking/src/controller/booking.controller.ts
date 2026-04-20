import { asyncHandler, apiError, apiResponse, roomModel, hotelModel, bookingModel } from "@packages"
import mongoose from "mongoose";
import * as crypto from "crypto";
import axios from "axios"


// use this for import 
//@ts-ignore
import {sendEmail} from "@packages"
// definitation of packages is in tsconfig.json file

const createBooking = asyncHandler(async (req: any, res: any) => {

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const { roomId, guests, checkIn, checkOut, paymentMethod } = req.body;
            const start = new Date(checkIn);
            const end = new Date(checkOut);

            if (start >= end) {
                throw new Error("Invalid entry of dates");
            }

            const room = await roomModel
                .findById(roomId)
                .session(session);

            if (!room) {
                throw new Error("Room not found");
            }

            if (room.capacity < guests) {
                throw new Error("Room capacity exceeded");
            }

            const existingBooking = await bookingModel
                .findOne({
                    room: roomId,
                    checkIn: { $lt: end },
                    checkOut: { $gt: start },
                    status: { $in: ["PENDING", "CONFIRMED"] }
                })
                .session(session);

            if (existingBooking) {
                throw new Error("Room not available");
            }

            const nights =
                (end.getTime() - start.getTime()) /
                (1000 * 60 * 60 * 24);

            const totalPrice = nights * room.pricePerNights;

            const booking = new bookingModel({
                user: req.user._id,
                hotel: room.hotel,
                room: roomId,
                guests,
                checkIn: start,
                checkOut: end,
                status: "PENDING",
                bookingPayment: "NOTPAID",
                totalPrice,
                paymentMethod
            });

            await booking.save({ session });

            const hotel = await hotelModel
                .findById(room.hotel)
                .session(session);

            if (paymentMethod === "ESEWA") {

                if (!hotel?.esewa_Merchantid) {
                    throw new Error("Hotel doesnot have merchant id");
                }

                const transaction_uuid = booking._id.toString();
                const product_code = hotel.esewa_Merchantid;
                const total_amount = totalPrice.toString();

                const signed_field_names =
                    "total_amount,transaction_uuid,product_code";

                const message =
                    `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

                const signature = crypto
                    .createHmac("sha256", process.env.ESEWA_HASH_SECRET!)
                    .update(message)
                    .digest("base64");

                const htmlForm = `<html>
                 <body onload="document.forms[0].submit()">
                 <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
                 <input type="hidden" name="total_amount" value="${total_amount}" />
                 <input type="hidden" name="transaction_uuid" value="${transaction_uuid}" />
                 <input type="hidden" name="product_code" value="${product_code}" />
                 <input type="hidden" name="signature" value="${signature}" />
                 <input type="hidden" name="signed_field_names" value="${signed_field_names}" />
                 <input type="hidden" name="success_url" value="${process.env.BASE_URL}/api/payment/esewa/success" />
                 <input type="hidden" name="failure_url" value="${process.env.BASE_URL}/api/payment/esewa/failure" />
                 </form>
                 </body>
                 </html>`;

                return apiResponse({ bookingId: booking._id, htmlForm }, 200, true, "Booking created via eSewa");
            }

            if (paymentMethod === "KHALTI") {

                if (!hotel?.khalti_SecretKey) {
                    throw new Error("Can't get the khalti secret key");
                }

                const totalpaisa = totalPrice * 100;

                const khaltires = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/",
                    {
                        return_url: `${process.env.BASE_URL}/api/payment/khalti/verify`,
                        website_url: `${process.env.FRONTEND_URL}`,
                        amount: totalpaisa,
                        purchase_order_id: booking._id.toString(),
                        purchase_order_name: `${hotel.hotelName}`,
                        customer_info: {
                            "name": req.user.Name,
                            "email": req.user.email,
                        }
                    },
                    {
                        headers: {
                            "Authorization": `Key ${hotel.khalti_SecretKey}`,
                            "Content-Type": "application/json",
                        }
                    }
                )

                const { pidx, payment_url } = khaltires.data

                await bookingModel.findByIdAndUpdate(booking._id,
                    { khalti_pidx: pidx },
                    { session }
                )

                return apiResponse({ bookingId: booking._id, payment_url }, 200, true, "Booking created via Khalti");
            }

            return res.json({
                success: true,
                booking
            });

        });

    } catch (error: any) {
        return apiError({}, 400, error.message);
    } finally {
        session.endSession();
    }
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
    } catch (error) {
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

export { khaltiVerify, createBooking, esewaSuccess }