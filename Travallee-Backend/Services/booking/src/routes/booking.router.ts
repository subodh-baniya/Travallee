import Router from "express"
import { esewaSuccess,createBooking, verifyBookingOtp, getGuestStatus,getBookingHistoryOfUser,createBookingFromHotel} from "../controller/booking.controller.js";
import { authenticate, hotelAdminMiddleware} from "../middleware/role.middleware.js";

const router = Router();


router.post("/esewa/success", esewaSuccess)
router.post("/create-booking", authenticate , createBooking)
router.post("/verify-otp", authenticate, verifyBookingOtp)

router.post("/create-booking-hotel",authenticate,hotelAdminMiddleware,createBookingFromHotel);

router.get("/guest-status/:HotelId", getGuestStatus)



router.get("/booking-history/:userId",  getBookingHistoryOfUser)


export default router