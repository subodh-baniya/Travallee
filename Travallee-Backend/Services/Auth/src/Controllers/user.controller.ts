import { apiError } from "../config/response/api.response.js";
import { asyncHandler } from "../config/asynchandler.js";
import { apiResponse } from "../config/response/api.response.js";
import { UserModel } from "../model/User.model.js";
import { uploadToCloudinary } from "../config/Func/cloudinary.js";
import { tokenBlacklistRedis } from "../middleware/role.middleware.js";
import { loginSchema, registerSchema } from "../Schema/user.schema.js";
import { z } from "zod";
import { Queue } from "bullmq";
import Redis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path:"./.env",
});

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME || "default",
};

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
  throw new Error("Missing Redis environment variables: REDIS_HOST, REDIS_PORT, REDIS_PASSWORD");
}

//@ts-ignore
const redisClient = new Redis(connection);

redisClient.on("error", (err: Error) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Connected to Redis successfully"));

//@ts-ignore
const subClient = new Redis(connection);

subClient.on("error", (err: Error) => console.error("Redis Sub Client Error:", err));

subClient.subscribe("newHotelApproved", async (err: Error | null) => {
  if (err) console.error("Failed to subscribe:", err);
});

subClient.on("message", async (channel: string, message: string) => {
  if (channel === "newHotelApproved") {
    try {
      console.log("Received message on newHotelApproved channel:", message);
      const data = JSON.parse(message);
      const result = await UserModel.updateOne(
        { _id: data.userID },
        {
          $set: {
            hotelId: new mongoose.Types.ObjectId(data.hotelId),
            role: "hotelAdmin",
          },
        }
      );
      console.log("Updated user with new hotel ID and role:", result);
      await redisClient.del(`user:${data.userID}`);
    } catch (err: any) {
      console.error("Error processing new hotel approval message:", err);
    }
  }
});


const registerEmailQueue = new Queue<RegisterEmailJobData>("Register", {
  connection,
});
const otpQueue = new Queue<OTPEmailJobData>("OTP", {
  connection,
});
const deleteAccountOtpQueue = new Queue<OTPEmailJobData>("DeleteAccountOTP", {
  connection,
});

interface OTPEmailJobData {
  email: string;
  Name: string;
  otp: number;
  subject?: string;
}

interface RegisterEmailJobData {
  userName: string;
  to: string;
  userId: string;
}

const registerUser = asyncHandler(async (req: any, res: any) => {
  try {
    const validate = registerSchema.parse(req.body);
    const existingUser = await UserModel.findOne({ Username: validate.Username });
    const existingEmail = await UserModel.findOne({ email: validate.email });

    if (existingEmail) return apiError(res, 400, "Email already exists");
    if (existingUser) return apiError(res, 400, "Username already exists");

    const otp = Math.floor(1000 + Math.random() * 9000);

    try {
      await otpQueue.add("SendOTP", {
        email: validate.email,
        Name: validate.Name.toUpperCase(),
        otp,
      });
    } catch (error: any) {
      console.log("Error in processing OTP email:", error);
    }

    return apiResponse(res, 201, true, "User registered successfully", {
      Username: validate.Username,
      email: validate.email,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return apiError(res, 400, "Validation Error", errors);
    }
    return apiError(res, 500, "Failed to register user", error);
  }
});

const verifyOTP = asyncHandler(async (req: any, res: any) => {
  const { email, otp, type } = req.body;

  try {
    if (type === "delete") {
      const result = await redisClient.get(`deleteOtp:${email}`);
      if (!result) return apiError(res, 400, "OTP has expired or is invalid");
      if (Number(result) !== Number(otp)) return apiError(res, 400, "Invalid OTP. Please provide the correct OTP.");

      await redisClient.del(`deleteOtp:${email}`);
      await UserModel.findOneAndDelete({ email });

      return apiResponse(res, 200, true, "Account deleted successfully");
    }

    if (type === "register") {
      const otpResult = await redisClient.get(`otp:${email}`);
      if (!otpResult) return apiError(res, 400, "OTP has expired or is invalid");
      if (Number(otpResult) !== Number(otp)) return apiError(res, 400, "Invalid OTP. Please provide the correct OTP.");

      await redisClient.del(`otp:${email}`);

      const pendingUser = await redisClient.get(`pendingUser:${email}`);
      if (!pendingUser) return apiError(res, 400, "No pending registration found for this email");

      const userData = JSON.parse(pendingUser);
      const newUser = new UserModel(userData);
      await newUser.save();

      await registerEmailQueue.add("SendWelcomeEmail", {
        userName: newUser.Name.toUpperCase(),
        to: newUser.email,
        userId: newUser._id.toString(),
      });

      await redisClient.del(`pendingUser:${email}`);

      return apiResponse(res, 200, true, "User registered successfully", newUser);
    }

    return apiError(res, 400, "Invalid type");
  } catch (err: any) {
    console.error("verifyOTP error:", err);
    return apiError(res, 500, "Internal server error");
  }
});

const loginUser = asyncHandler(async (req: any, res: any) => {
  try {
    const validate = loginSchema.parse(req.body);
    const user = await UserModel.findOne({ Username: validate.Username as string });

    if (!user) return apiError(res, 400, "Username doesn't exist");

    const isPasswordValid = await user.comparePassword(validate.password);
    if (!isPasswordValid) return apiError(res, 400, "Invalid password");

    if (validate.hotelId) {
      await UserModel.updateOne({ _id: user._id }, { hotelId: validate.hotelId || null });
    }

    if (validate.superAdminKey) {
      const isSuperAdminKeyValid = await user.compareSuperAdminKey(validate.superAdminKey);
      if (!isSuperAdminKeyValid) {
        return apiError(res, 400, "Invalid super admin key. Please provide the correct key or contact support.");
      }
    }

    const token = user.generateJWT();
    user.refreshToken = token;
    user.role = req.body.role || user.role;
    await user.save();

    await redisClient.set(`user:${user._id}`, JSON.stringify(user), "EX", 24 * 60 * 60);
    await redisClient.set(`token:${user._id}`, token, "EX", 24 * 60 * 60 * 3);

    const options = {
      httpOnly: true,
      secure:true,
      sameSite: "none" as const,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("token", token, options);

    return apiResponse(res, 200, true, "User logged in successfully", {
      role: user.role,
      token,
      Hotelid: user.hotelId,
      name: user.Name,
      email: user.email,
      superAdminKey: user.superAdminKey,
      id: user._id,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return apiError(res, 400, "Only username and proper password is accepted", errors);
    }
    return apiError(res, 500, "Failed to login user", error);
  }
});

const logoutUser = asyncHandler(async (req: any, res: any) => {
  const token = req.token;
   const options = {
      httpOnly: true,
      secure:true,
      sameSite: "none" as const,
    };

  res.clearCookie("token",options);
  res.setHeader("Authorization", "");
  return apiResponse(res, 200, true, "User logged out successfully");
});

const getUserProfile = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  try {
    const result = await redisClient.get(`user:${userId}`);
    if (result) {
      return apiResponse(res, 200, true, "User profile retrieved successfully (from cache)", JSON.parse(result));
    }

    const user = await UserModel.findById(userId).select("-password");
    if (!user) return apiError(res, 404, "User not found");

    await redisClient.set(`user:${userId}`, JSON.stringify(user), "EX", 60 * 60 * 24 * 3);

    return apiResponse(res, 200, true, "User profile retrieved successfully", user);
  } catch (error: any) {
    console.error("Error retrieving user profile:", error);
    return apiError(res, 500, "Internal server error");
  }
});

const updateUserProfile = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const profileImage = req.file;
  const { Name, email, number } = req.body;

  if (!Name && !email && !number && !profileImage) {
    return apiError(res, 400, "At least one field must be provided for update");
  }

  const user = await UserModel.findById(userId).select("-password -refreshToken");
  if (!user) return apiError(res, 404, "User not found");

  if (profileImage) {
    try {
      const response = await uploadToCloudinary(profileImage.path, "profile_pictures");
      user.profileimage = response;
    } catch (error: any) {
      console.error("Error uploading profile image to Cloudinary:", error);
      return apiError(res, 500, "Failed to upload profile image", error);
    }
  }

  if (Name) user.Name = Name;
  if (email) user.email = email;
  if (number) user.number = number;

  await user.save();
  return apiResponse(res, 200, true, "User profile updated successfully", user);
});

const deleteAccount = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId);
  if (!user) return apiError(res, 404, "User not found");

  const otp = Math.floor(1000 + Math.random() * 9000);
  await redisClient.set(`deleteOtp:${user.email}`, otp, "EX", 10 * 60);

  try {
    await deleteAccountOtpQueue.add("DeleteAccountOTP", {
      email: user.email,
      Name: user.Name.toUpperCase(),
      otp,
      subject: "OTP for Account Deletion - Travallee",
    });
  } catch (error: any) {
    console.log("Error in processing OTP email for account deletion:", error);
  }

  return apiResponse(res, 200, true, "OTP sent to email for account deletion verification");
});

const googleAuth = asyncHandler(async (req: any, res: any) => {
  const userProfile = req.user;
  const token = userProfile.generateJWT();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 24 * 60 * 60 * 1000,
  };
  res.setHeader("Authorization", `Bearer ${token}`);
  res.cookie("token", token, options);
  return apiResponse(res, 200, true, "Google authentication successful", userProfile);
});

const updateHotelUserPassword = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) return apiError(res, 400, "Current password and new password are required");
  if (newPassword.length < 8) return apiError(res, 400, "New password must be at least 8 characters");
  if (currentPassword === newPassword) return apiError(res, 400, "New password must be different from current password");

  try {
    const user = await UserModel.findById(userId);
    if (!user) return apiError(res, 404, "User not found");

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) return apiError(res, 400, "Current password is incorrect");

    user.password = newPassword;
    await user.save();

    await Promise.all([
      redisClient.del(`user:${userId}`),
      redisClient.del(`token:${userId}`),
    ]);

    return apiResponse(res, 200, true, "Password updated successfully");
  } catch (error: any) {
    console.error("Error updating password:", error);
    return apiError(res, 500, "Internal server error: Unable to update password");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  verifyOTP,
  deleteAccount,
  updateHotelUserPassword,
};