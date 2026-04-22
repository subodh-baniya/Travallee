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
//@ts-ignore
import { authenticate , upload} from "@packages";


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
router.get("/profile", authenticate, getUserProfile);
router.post("/update-profile", authenticate, upload.single("profileImage"), updateUserProfile);
router.delete("/delete-profile", authenticate, deleteUserProfile);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/profile-picture", authenticate, getUserProfilePicture);



export default router;