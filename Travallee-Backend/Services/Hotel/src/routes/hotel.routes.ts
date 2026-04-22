import { Router } from "express";
import {
  registerHotel,
  createroom,
  deleteRoom,
  featuredHotels,
  HotelData,
  getHotelInfo,
  highReviewedHotels,
  getAllHotels,
  getAllResortHotels,
} from "../controller/register.controller.js";

import {
  connectDB,
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
  uploadToCloudinary, 
  upload,//@ts-ignore
} from "@packages";

const router = Router();

router.post("/register", authenticate, upload.any(), registerHotel);
router.get("/my-hotel", authenticate, getHotelInfo);
router.post("/room/:hotelId", authenticate, upload.any(), createroom);
router.delete("/room/:hotelId/:roomId", authenticate, deleteRoom);
router.get("/featured", authenticate, featuredHotels);
router.get("/high-reviewed", authenticate, highReviewedHotels);
router.get("/hotels", authenticate, getAllHotels);
router.get("/resorts", authenticate, getAllResortHotels);
router.get("/:hotelId", authenticate, HotelData);

export default router;
