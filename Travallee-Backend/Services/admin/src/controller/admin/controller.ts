import redis from "ioredis"
import {asyncHandler} from "../../config/asynchandler.js"
import {  apiResponse,apiError } from "../../config/response/api.response.js"
import { createClient } from "redis";
import { io } from "../../app.js";
import {adminModel} from "../../model/Hotel.admin.js";

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
//@ts-ignore this is for pub sub model
const adminPub = new redis(connection);

sub.subscribe("bookingConfirmed",async (BookingData: string) => {
        const bookingData = JSON.parse(BookingData);
        io.to(`hotel_${bookingData.hotelId}`).emit("new_booking", bookingData);
        io.to(`hotel_${bookingData.hotelId}`).emit("booking_notification", {
            title: "New booking confirmed  for room " + bookingData.roomNumber,
            message: `${bookingData.userName || bookingData.name || "Guest"} booked room ${bookingData.roomNumber || "-"} for ${bookingData.stayDurationNights || 1} night(s), amount Rs.${bookingData.amount || "-"}, ${bookingData.paymentMethod || "-"} (${bookingData.bookingPayment || "-"})`,
            bookingId: bookingData.bookingId,
            userId: bookingData.userId,
            hotelId: bookingData.hotelId,
            amount: bookingData.amount,
            paymentMethod: bookingData.paymentMethod,
            bookingPayment: bookingData.bookingPayment,
            stayDurationNights: bookingData.stayDurationNights,
            status: bookingData.status,
            createdAt: new Date().toISOString(),
        });
        adminPub.set(`booking_${bookingData.bookingId}`, JSON.stringify(bookingData), "EX", 60 * 60 ); // Store booking data for 24 hours
    })

//@ts-ignore this is for pub sub model 
const adminPub = new redis(connection);

const getBookingData = asyncHandler(async (req: any, res: any) => {
    const { bookingId } = req.params;
    if (!bookingId) {
        return apiError(res, 400, "Booking ID is required");
    }

});

export {
    getBookingData
}