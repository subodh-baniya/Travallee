import Router from "express"
import {createBooking, verifyBookingOtp, getGuestStatus,getBookingHistoryOfUser,createBookingFromHotel,calculateIncomeHotel,calculatePendingIncomeHotel} from "../controller/booking.controller.js";
import { authenticate, hotelAdminMiddleware} from "../middleware/role.middleware.js";

const router = Router();


router.post("/create-booking", authenticate , createBooking)
router.post("/verify-otp", authenticate, verifyBookingOtp)
router.post("/create-booking-hotel",authenticate,hotelAdminMiddleware,createBookingFromHotel);
//baki
router.get("/calculate-income/:hotelId", calculateIncomeHotel);
router.get("/calculate-pending-income/:hotelId", calculatePendingIncomeHotel);

router.get("/guest-status/:HotelId", getGuestStatus)



router.get("/booking-history/:userId",  getBookingHistoryOfUser)


export default router