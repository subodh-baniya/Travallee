import { Router } from "express";
import {registerHotel , createroom ,deleteRoom , featuredHotels, HotelData, getHotelInfo} from "../controller/register.controller.js";

import { connectDB,
    UserModel,
    apiError,
    asyncHandler,
    apiResponse,
    hotelModel,
    authenticate,
    checkRole,
    checkRoles,
    adminMiddleware,
    hotelOwnerMiddleware,
    userMiddleware,
    superAdminMiddleware,
    hotelAdminMiddleware,
    adminOrOwnerMiddleware,
    anyAuthenticatedMiddleware,
    superAdminOrHotelAdminMiddleware,
    checkOwnership,
    passwordCheck,
    roomModel,
    bookingModel,
    uploadToCloudinary,//@ts-ignore
    upload,} from "@packages"


const router = Router();

router.post("/register", authenticate, upload.any(), registerHotel);
router.get("/my-hotel", authenticate, getHotelInfo);
router.post("/room/:hotelId", authenticate, upload.any(), createroom);
router.delete("/room/:hotelId/:roomId", deleteRoom); 
router.get("/featured", featuredHotels); 
router.get("/:hotelId", HotelData);



export default router;