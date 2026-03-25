import { Router } from "express";
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
  getUserProfilePicture
} from "../Controllers/user.controller.js";

import passport from "passport";


const router = Router();

router.post("/register", registerUser);
router.post("/logout",  logoutUser);
router.post("/login", loginUser);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email" ],
  }),
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleAuth
);
router.get("/profile",  getUserProfile);
router.put("/update-profile", updateUserProfile);
router.delete("/delete-profile", deleteUserProfile);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/profile-picture", getUserProfilePicture);



export default router;