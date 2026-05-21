import { Router } from "express";
import {
  registerHotel,
  createroom,
  // deleteRoom,
  featuredHotels,
  HotelData,
  getHotelInfo,
  highReviewedHotels,
  getAllHotels,
  getAllResortHotels,
  RoomData,
  displayRooms,
  getHotelByLocation
} from "../controller/register.controller.js";

import { authenticate } from "../middleware/role.middleware.js";
import { upload } from "../middleware/mullter.middleware.js";

const router = Router();

router.post("/register", authenticate, upload.any(), registerHotel);

// router.get("/dashboard", authenticate, getHotelDashboard);

router.get("/my-hotel", authenticate, getHotelInfo);

router.get("/featured", authenticate, featuredHotels);

router.get("/high-reviewed", authenticate, highReviewedHotels);

router.get("/hotels", authenticate, getAllHotels);

router.get("/resorts", authenticate, getAllResortHotels);

router.get("/location/:location", getHotelByLocation);

router.post("/room/:hotelId", authenticate, upload.any(), createroom);

router.get("/rooms/:hotelId", authenticate, RoomData);

router.get("/display-rooms/:hotelId", authenticate, displayRooms);

// router.delete("/room/:hotelId/:roomId", authenticate, deleteRoom);

router.get("/:hotelId", authenticate, HotelData);



export default router;
