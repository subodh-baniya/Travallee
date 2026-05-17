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
  RoomData,
  getHotelDashboard
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
router.get("/featured", authenticate, featuredHotels);
router.get("/high-reviewed", authenticate, highReviewedHotels);
router.get("/hotels", authenticate, getAllHotels);
router.get("/resorts", authenticate, getAllResortHotels);
router.post("/room/:hotelId", authenticate, upload.any(), createroom);
router.get("/:hotelId", authenticate, HotelData);
router.delete("/room/:hotelId/:roomId", authenticate, deleteRoom);
router.get("/rooms/:hotelId", authenticate, RoomData);
router.get("/dashboard", authenticate, getHotelDashboard);

export default router;
