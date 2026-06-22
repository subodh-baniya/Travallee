import { Router } from "express";
import{ getBookingHistoryByHotelId,getGuestStatus, getTransactionHistoryOfHotel } from "../controller/admin/controller.js";
import { getNewRegistration, approveRegistration, declineRegistration,  } from "../controller/Superadmin/add.controller.js";

const router = Router();
    
router.get("/booking-history/:hotelId", getBookingHistoryByHotelId);
router.get("/guest-status/:bookingId", getGuestStatus);
router.get('/transaction-history/:hotelId', getTransactionHistoryOfHotel);
// Hotel registration routes

router.get("/hotel-registrations", getNewRegistration);
router.post("/hotel-registrations/:userID/approve", approveRegistration);
router.post("/hotel-registrations/:userID/decline", declineRegistration);

export default router;  