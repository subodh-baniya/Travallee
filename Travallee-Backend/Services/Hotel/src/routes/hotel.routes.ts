import { Router } from "express";
<<<<<<< HEAD
import {registerHotel , createroom ,deleteRoom , featuredHotels} from "../controller/register.controller.js";
=======
import {registerHotel , createroom ,deleteRoom , featuredHotels, HotelData} from "../controller/register.controller.js";
>>>>>>> f51a6882f5123d8310b442b6378b71ec4bb80f6d

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

<<<<<<< HEAD
router.post("/register", registerHotel);
router.post("/room/:hotelId", createroom);
router.delete("/room/:hotelId/:roomId",deleteRoom); 
=======
router.post("/register", authenticate, upload.any(), registerHotel);
router.post("/room/:hotelId", authenticate, upload.any(), createroom);
router.delete("/room/:hotelId/:roomId", deleteRoom); 
>>>>>>> f51a6882f5123d8310b442b6378b71ec4bb80f6d
router.get("/featured", featuredHotels); 



export default router;