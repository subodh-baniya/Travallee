import { asyncHandler } from "../config/asynchandler.js";
import { apiError, apiResponse } from "../config/response/api.response.js";
import { bookingModel } from "../model/Booking.model.js";
import mongoose from "mongoose";
import axios from "axios";
import { BookingConfirmationJobData, createBookingSchema } from "../schema/bokingschems.js";
import { z } from "zod";
import { Queue } from "bullmq";
import redis from "ioredis";
import { createClient } from "redis";

const connection = {
  host: process.env.REDIS_HOST as string,
  port: Number(process.env.REDIS_PORT),
};

// @ts-ignore this is for saving otp and booking data temporarily before confirmation, it will be deleted after confirmation or expiration
const bookingRedis = new redis(connection);
const bookingConfirmationQueue = new Queue<BookingConfirmationJobData>("bookingConfirmationOtp", {
  connection,
});

const PaymentdataQueue = new Queue("paymentDataQueue", {
  connection,
});

const pub = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

pub.connect();

const createBooking = asyncHandler(async (req: any, res: any) => {
  let validated: any;
  const userId = req.user.id;
  const { email, Name } = req.user;

  try {
    validated = createBookingSchema.parse({ ...req.body, userId, userEmail: email, userName: Name });
    console.log("Validated booking data:", validated);
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

  let roomObjectId: mongoose.Types.ObjectId;
  let hotelObjectId: mongoose.Types.ObjectId;

  try {
    roomObjectId = new mongoose.Types.ObjectId(validated.roomId);
    hotelObjectId = new mongoose.Types.ObjectId(validated.hotelId);
  } catch {
    return apiError(res, 400, "Invalid room or hotel ID format");
  }

  const bookedDates = await bookingModel.find({
    room: roomObjectId,
    hotel: hotelObjectId,
    status: { $in: ["PENDING", "CONFIRMED"] },
    bookingPayment: "PAID",
    $or: [{ checkIn: { $lt: new Date(validated.checkOut) }, checkOut: { $gt: new Date(validated.checkIn) } }],
  });

  if (bookedDates.length > 0) {
    return apiError(res, 400, "Room is not available for the selected dates");
  }

  const newBooking = {
    user: validated.userId,
    Name: validated.Name,
    hotel: hotelObjectId,
    room: roomObjectId,
    guests: validated.guests,
    checkIn: new Date(validated.checkIn),
    checkOut: new Date(validated.checkOut),
    totalPrice: validated.totalPrice,
    paymentMethod: validated.paymentMethod,
    bookingPayment: validated.paymentMethod === "COD" ? "NOTPAID" : "PAID",
    status: validated.paymentMethod === "COD" ? "PENDING" : "CONFIRMED",
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
    otp,
  });

  await bookingRedis.set(`booking:${validated.userId}`, JSON.stringify(newBooking), "EX", 15 * 60);

  return apiResponse(res, 201, true, "Otp sent successfully", { otpSent: true, expiresIn: 15 * 60 });
});
const verifyBookingOtp = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const { otp } = req.body;
  const Name = req.user.Name;

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
  const fallbackBookingPayment = bookingData.paymentMethod === "COD" ? "NOTPAID" : "PAID";
  const fallbackStatus = bookingData.paymentMethod === "COD" ? "PENDING" : "CONFIRMED";
  const bookingPayment = ["PAID", "NOTPAID"].includes(bookingData.bookingPayment)
    ? bookingData.bookingPayment
    : fallbackBookingPayment;
  const status = ["PENDING", "CONFIRMED", "CANCELLED"].includes(bookingData.status)
    ? bookingData.status
    : fallbackStatus;

  const checkInDate = new Date(bookingData.checkIn);
  const checkOutDate = new Date(bookingData.checkOut);

  const newBooking = new bookingModel({
    user: userId,
    Name: Name,
    hotel: bookingData.hotelId,
    room: bookingData.roomId,
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    guests: bookingData.guests,
    totalPrice: bookingData.totalPrice,
    paymentMethod: bookingData.paymentMethod,
    bookingPayment,
    status,
    hotelName: bookingData.hotelName,
    roomNumber: bookingData.roomNumber,
    email: bookingData.email || bookingData.userEmail || req.user.email,
  });

  await newBooking.save();

  await bookingRedis.del(`booking_otp:${userId}`);
  await PaymentdataQueue.add("paymentData", {
    hotelId: bookingData.hotelId,
    price: bookingData.totalPrice,
    status,
  });

  await bookingRedis.del(`booking:${userId}`);

  await pub.publish(
    "bookingConfirmed",
    JSON.stringify({
      userId,
      hotelId: bookingData.hotelId,
      roomId: bookingData.roomId,
      hotelName: bookingData.hotelName,
      name: bookingData.Name,
      email: bookingData.userEmail,
      userName: bookingData.userName,
      bookingId: newBooking._id,
      checkInDate: bookingData.checkIn,
      checkOutDate: bookingData.checkOut,
      amount: bookingData.totalPrice,
      paymentMethod: bookingData.paymentMethod,
      bookingPayment,
      roomNumber: bookingData.roomNumber,
      status,
    }),
  );


  try {
    await axios.post(`${process.env.HOTEL_SERVICE_URL}/booking-history`, {
      bookingId: String(newBooking._id),
      hotelId: bookingData.hotelId,
      userId,
      roomId: bookingData.roomId,
      guestName: bookingData.userName,
      roomNumber: bookingData.roomNumber,
      checkinDate: bookingData.checkIn,
      checkoutDate: bookingData.checkOut,
      totalPrice: bookingData.totalPrice,
      paymentMethod: bookingData.paymentMethod,
      bookingPayment,
      status,
      guests: bookingData.guests,
      email: req.user.email,
    });
  } catch (error: any) {
    console.error("Failed to sync booking history with Hotel service:", error?.message || error);
  }

  console.log("Published booking confirmation for booking ID:", newBooking._id);
  return apiResponse(res, 200, true, "Booking confirmed successfully", newBooking);
});
const esewaSuccess = asyncHandler(async (req: any, res: any) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    const bookingId = decoded.transaction_uuid;

    const verifyResponse = await axios.get("https://rc-epay.esewa.com.np/api/epay/transaction/status/", {
      params: {
        product_code: decoded.product_code,
        total_amount: decoded.total_amount,
        transaction_uuid: bookingId,
      },
    });

    if (verifyResponse.data.status == "COMPLETE") {
      await bookingModel.findByIdAndUpdate(bookingId, {
        status: "CONFIRMED",
        bookingPayment: "PAID",
        paymentReferenceId: decoded.ref_id,
      });

      return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
    }

    await bookingModel.findByIdAndUpdate(bookingId, {
      status: "CANCELLED",
    });

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  } catch (error: any) {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
});
const getBookingHistoryOfUser = asyncHandler(async (req: any, res: any) => {
  const userId = req.params.userId;
  try {
    const bookings = await bookingModel.find({ user: userId })
    const response = {
      bookings: bookings.map((booking) => ({
        bookingId: booking._id,
        hotelName: booking.hotelName,
        roomNumber: booking.roomNumber,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      }))
    };
    return apiResponse(res, 200, true, "Booking history retrieved successfully", response);
  } catch (error: any) {
    console.error("Error retrieving booking history:", error);
    return apiError(res, 500, "Unable to retrieve booking history");
  }
});

const createBookingFromHotel = asyncHandler(async (req: any, res: any) => {
  let validated: any;
  const userId = req.user.id;
  const { email, Name } = req.body;

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

  let roomObjectId: mongoose.Types.ObjectId;
  let hotelObjectId: mongoose.Types.ObjectId;

  try {
    roomObjectId = new mongoose.Types.ObjectId(validated.roomId);
    hotelObjectId = new mongoose.Types.ObjectId(validated.hotelId);
  } catch {
    return apiError(res, 400, "Invalid room or hotel ID format");
  }

  const bookedDates = await bookingModel.find({
    room: roomObjectId,
    hotel: hotelObjectId,
    status: { $in: ["PENDING", "CONFIRMED"] },
    bookingPayment: "PAID",
    $or: [{ checkIn: { $lt: new Date(validated.checkOut) }, checkOut: { $gt: new Date(validated.checkIn) } }],
  });

  if (bookedDates.length > 0) {
    return apiError(res, 400, "Room is not available for the selected dates");
  }

  const checkInDate = new Date(validated.checkIn);
  const checkOutDate = new Date(validated.checkOut);
  const totalNights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const newBooking = new bookingModel({
    user: validated.userId,
    Name: validated.userName,
    hotel: hotelObjectId,
    room: roomObjectId,
    guests: validated.guests,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice: validated.totalPrice,
    totalNights,
    paymentMethod: validated.paymentMethod,
    bookingPayment: "PAID",
    status: "CONFIRMED",
    hotelName: validated.hotelName,
    roomNumber: validated.roomNumber,
    email: validated.userEmail,
  });

  await newBooking.save();

  await pub.publish(
    "bookingConfirmed",
    JSON.stringify({
      userId,
      hotelId: validated.hotelId,
      roomId: validated.roomId,
      name: Name,
      email: validated.userEmail,
      userName: validated.userName,
      bookingId: newBooking._id,
      checkInDate: validated.checkIn,
      checkOutDate: validated.checkOut,
      amount: validated.totalPrice,
      paymentMethod: validated.paymentMethod,
      bookingPayment: "PAID",
      roomNumber: validated.roomNumber,
      status: "CONFIRMED",
    }),
  );

  try {
    await axios.post(`${process.env.HOTEL_SERVICE_URL}/booking-history`, {
      bookingId: String(newBooking._id),
      hotelId: validated.hotelId,
      userId,
      hotel: validated.hotelName,
      roomId: validated.roomId,
      guestName: validated.userName,
      roomNumber: validated.roomNumber,
      checkinDate: validated.checkIn,
      checkoutDate: validated.checkOut,
      totalPrice: validated.totalPrice,
      paymentMethod: validated.paymentMethod,
      bookingPayment: "PAID",
      status: "CONFIRMED",
      guests: validated.guests,
      email: email,
    });
  } catch (error: any) {
    console.error("Failed to sync booking history with Hotel service:", error?.message || error);
  }

  return apiResponse(res, 201, true, "Booking confirmed successfully", newBooking);
});




















//admin
const getGuestStatus = asyncHandler(async (req: any, res: any) => {
  const { HotelId } = req.params;
  console.log("Received request for guest status with hotelId:", HotelId);
  let status: string = "UNKNOWN";
  let Booking: any = null;
  if (!HotelId) {
    return apiError(res, 400, "Hotel ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(HotelId)) {
    return apiError(res, 400, "Invalid Hotel ID format");
  }
  Booking = await bookingModel.findOne({ hotel: HotelId })
  if (!Booking) {
    return apiError(res, 404, "Booking not found");
  }
  if (Booking.checkIn > new Date()) {
    status = "UPCOMING";

  }
  if (Booking.checkOut < new Date()) {
    status = "Checked Out";
  }
  if (Booking.checkIn <= new Date() && Booking.checkOut >= new Date()) {
    status = "CHECKED IN";
  }

  const responseData = {
    status,
    bookingName: Booking.Name,
    BookingtotalNights: Booking.totalNights,
    BookingCheckIn: Booking.checkIn,
    BookingCheckOut: Booking.checkOut,
    TotalMoneySpent: Booking.totalPrice,
    BookingPayment: Booking.bookingPayment,
    BookingPaymentMethod: Booking.paymentMethod,
    bookingRoomNumber: Booking.roomNumber,
  };

  return apiResponse(res, 200, true, "Guest status retrieved successfully", responseData);
});

const calculateIncomeHotel = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required");
  }
  await bookingModel.aggregate([
    { $match: { hotel: new mongoose.Types.ObjectId(hotelId), bookingPayment: "PAID" } },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$totalPrice" },
      },
    },
  ]).then((result) => {
    const totalIncome = result[0]?.totalIncome || 0;  
    return apiResponse(res, 200, true, "Total income calculated successfully", { totalIncome });
  }).catch((error: any) => {
    console.error("Error calculating total income:", error);
    return apiError(res, 500, "Unable to calculate total income");
  });
});
const calculatePendingIncomeHotel = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required");
  } 
  await bookingModel.aggregate([
    { $match: { hotel: new mongoose.Types.ObjectId(hotelId), bookingPayment: "NOTPAID" } },
    { $group: {
        _id: null,
        totalPendingIncome: { $sum: "$totalPrice" },
      },  
    },
  ]).then((result) => {
    const totalPendingIncome = result[0]?.totalPendingIncome || 0;
    return apiResponse(res, 200, true, "Total pending income calculated successfully", { totalPendingIncome });
  }).catch((error: any) => {
    console.error("Error calculating total pending income:", error);
    return apiError(res, 500, "Unable to calculate total pending income");
  });
});
export { createBooking, createBookingFromHotel, esewaSuccess, verifyBookingOtp, getGuestStatus, getBookingHistoryOfUser, calculateIncomeHotel, calculatePendingIncomeHotel};
