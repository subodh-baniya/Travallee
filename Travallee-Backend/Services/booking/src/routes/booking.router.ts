import Router from "express"
import { esewaSuccess,createBooking, khaltiVerify } from "../controller/booking.controller.js";

import { 
  loginUser,
  logoutUser,
  registerUser,
  googleAuth,
  deleteUserProfile,
  updateUserProfile,
  getUserProfile,
  sendOTP,
  verifyOTP,
  authenticate,
  getUserProfilePicture //@ts-ignore
} from "@packages";

const router = Router();


router.post("/esewa/success", esewaSuccess)

router.post("/khalti/verify", khaltiVerify)

router.post("/create-booking", authenticate,createBooking)


export default router