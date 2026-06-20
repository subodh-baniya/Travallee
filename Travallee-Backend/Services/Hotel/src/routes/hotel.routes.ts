import { Router } from "express";
import {
  registerHotelRequest,
  createroom,
  deleteRoom,
  featuredHotels,
  HotelData,
  syncBookingHistory,
  getBookingHistoryByHotelId,
  getHotelInfo,
  highReviewedHotels,
  getAllHotels,
  getAllResortHotels,
  RoomData,
  displayRooms,
  getHotelByLocation,
  getPaymentCredentials,
  getAllRatings,
  approveRegistration,
  declineRegistration,
  updateHotelInfo,
  updateHotelGallery,
  deleteHotelGalleryImage,
  updateRoomImages,
  updateRoomInfo
} from "../controller/register.controller.js";

import { authenticate } from "../middleware/role.middleware.js";
import { upload } from "../middleware/mullter.middleware.js";

const router = Router();

router.post("/register", authenticate, upload.any(), registerHotelRequest);

// router.get("/dashboard", authenticate, getHotelDashboard);

router.get("/my-hotel", authenticate, getHotelInfo);

router.get("/featured", authenticate, featuredHotels);

router.get("/high-reviewed", authenticate, highReviewedHotels);

router.get("/hotels", authenticate, getAllHotels);

router.get("/resorts", authenticate, getAllResortHotels);
router.post("/approve-registration", approveRegistration);
router.post("/decline-registration", declineRegistration);

router.get("/location/:location", getHotelByLocation);

router.post("/update-hotel-gallery/:hotelId", authenticate, upload.any(), updateHotelGallery);
router.delete("/delete-hotel-gallery-image/:hotelId", authenticate, deleteHotelGalleryImage);

router.post("/room/:hotelId", authenticate, upload.any(), createroom);

router.post("/update-hotel-info/:hotelId", updateHotelInfo);

router.get("/rooms/:hotelId", authenticate, RoomData);

router.get("/display-rooms/:hotelId", authenticate, displayRooms);
router.post("/booking-history", syncBookingHistory);

router.get("/ratings/:hotelId",  getAllRatings);

router.get("/booking-history/:hotelId", getBookingHistoryByHotelId);

router.get("/hotel/:hotelId", authenticate, getHotelInfo);

router.get("/:hotelId", authenticate, HotelData);

router.get("/payment-credentials/:hotelId", authenticate, getPaymentCredentials);

router.delete("/room/:roomId", authenticate, deleteRoom);

router.post("/update-room-info/:roomId", authenticate, updateRoomInfo);
router.post("/update-room-images/:roomId", authenticate, upload.any(), updateRoomImages);

export default router;
