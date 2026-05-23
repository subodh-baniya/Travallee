import { Router } from "express";
import{ getBookingDataNOtification } from "../controller/admin/controller.js";




const router = Router();
    
router.get("/booking-confirmations", getBookingDataNOtification);

export default router;  