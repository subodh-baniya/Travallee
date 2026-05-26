import { Router } from "express";
import{ getBookingHistoryByHotelId,getGuestStatus } from "../controller/admin/controller.js";




const router = Router();
    
router.get("/booking-history/:hotelId", getBookingHistoryByHotelId);
router.get("/guest-status/:bookingId", getGuestStatus);


export default router;  