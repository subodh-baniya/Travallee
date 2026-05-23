import { Router } from "express";
import{ getBookingHistoryByHotelId } from "../controller/admin/controller.js";




const router = Router();
    
router.get("/booking-history/:hotelId", getBookingHistoryByHotelId);

export default router;  