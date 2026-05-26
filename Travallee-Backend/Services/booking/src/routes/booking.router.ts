import Router from "express"
import { esewaSuccess,createBooking, verifyBookingOtp, getGuestStatus,getBookingHistoryOfUser} from "../controller/booking.controller.js";
import { authenticate } from "../middleware/role.middleware.js";

const router = Router();


router.post("/esewa/success", esewaSuccess)
router.post("/create-booking", authenticate , createBooking)
router.post("/verify-otp", authenticate, verifyBookingOtp)
router.get("/guest-status/:HotelId", getGuestStatus)


router.get("/booking-history/:userId",  getBookingHistoryOfUser)


export default router