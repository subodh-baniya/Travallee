import Router from "express"
import { esewaSuccess,createBooking, verifyBookingOtp, getGuestStatus, } from "../controller/booking.controller.js";
import { authenticate } from "../middleware/role.middleware.js";

const router = Router();


router.post("/esewa/success", esewaSuccess)
router.post("/create-booking", authenticate , createBooking)
router.post("/verify-otp", authenticate, verifyBookingOtp)
router.get("/guest-status/:bookingId", getGuestStatus)



export default router