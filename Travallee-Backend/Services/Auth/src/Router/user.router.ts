import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  googleAuth,
  updateUserProfile,
  getUserProfile,
  verifyOTP,
  updateUserRole,
} from "../Controllers/user.controller.js";

import passport from "passport";

import { authenticate } from "../middleware/role.middleware.js";
import { upload } from "../middleware/mullter.middleware.js";


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
router.post("/verify-otp", verifyOTP);
router.get("/user-profile", authenticate, getUserProfile);
router.patch("/internal/update-role", updateUserRole);




export default router;