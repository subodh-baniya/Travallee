import { Router } from "express";
import{ getBookingConfirmations } from "../controller/admin/controller.js";




const router = Router();
    
router.get("/booking-confirmations", getBookingConfirmations);

export default router;  