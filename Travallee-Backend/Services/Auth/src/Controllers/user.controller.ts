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
import axios from "axios";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
}

// @ts-ignore 
const registerRedis = new Redis(connection); const UserProfileRedis = new Redis(connection);



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


// logic for user registration, login, logout, profile management, and OTP verification
const registerUser = asyncHandler(async (req: any, res: any) => {
  try {
    const validate = registerSchema.parse(req.body);
    const existingUser = await UserModel.findOne({
      Username: validate.Username,
    });
    const existingEmail = await UserModel.findOne({
      email: validate.email,
    });
    if (existingEmail) {
      return apiError(res, 400, "Email already exists");
    }

    if (existingUser) {
      return apiError(res, 400, "Username already exists");
    }

    

    const otp = Math.floor(1000 + Math.random() * 9000);

    registerRedis.set(`otp:${validate.email}`, otp, "EX", 10 * 60); // Store OTP in Redis with 10 minutes expiration

    try {
      otpQueue.add("SendOTP", {
        email: validate.email,
        Name: validate.Name.toUpperCase(),
        otp,
      });
    } catch (error: any) {
      console.log("error in processing OTP email:", error);
    }

    registerRedis.set(`pendingUser:${validate.email}`, JSON.stringify(validate), "EX", 10 * 60);

    return apiResponse(
      res,
      201,
      true,
      "User registered successfully",
      { Username: validate.Username, email: validate.email },
    );
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

  let userData: any;

  try {
    if (type === "delete") {
      const result = await new Promise<string | null>((resolve, reject) => {
        registerRedis.get(`deleteOtp:${email}`, (err: any, result: any) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      if (!result) {
        return apiError(res, 400, "OTP has expired or is invalid");
      }

      if (Number(result) !== Number(otp)) {
        return apiError(res, 400, "Invalid OTP. Please provide the correct OTP.");
      }

      await new Promise<void>((resolve, reject) => {
        registerRedis.del(`deleteOtp:${email}`, (err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });

      await UserModel.findOneAndDelete({ email });

      return apiResponse(res, 200, true, "Account deleted successfully");
    }


    if (type === "register") {
      const otpResult = await new Promise<string | null>((resolve, reject) => {
        registerRedis.get(`otp:${email}`, (err: any, result: any) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      if (!otpResult) {
        return apiError(res, 400, "OTP has expired or is invalid");
      }

      if (Number(otpResult) !== Number(otp)) {
        return apiError(res, 400, "Invalid OTP. Please provide the correct OTP.");
      }

      await new Promise<void>((resolve, reject) => {
        registerRedis.del(`otp:${email}`, (err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });

      const pendingUser = await new Promise<string | null>((resolve, reject) => {
        registerRedis.get(`pendingUser:${email}`, (err: any, result: any) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      if (!pendingUser) {
        return apiError(res, 400, "No pending registration found for this email");
      }

      userData = JSON.parse(pendingUser);

      const newUser = new UserModel(userData);
      await newUser.save();

      await registerEmailQueue.add("SendWelcomeEmail", {
        userName: newUser.Name.toUpperCase(),
        to: newUser.email,
        userId: newUser._id.toString(),
      });

      await new Promise<void>((resolve, reject) => {
        registerRedis.del(`pendingUser:${email}`, (err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });

      return apiResponse(
        res,
        200,
        true,
        "User registered successfully",
        newUser
      );
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
    if (!user) {
      return apiError(res, 400, "Username don't exist");
    }
    const isPasswordValid = await user.comparePassword(validate.password);
    if (!isPasswordValid) {
      return apiError(res, 400, "Invalid password");
    }
    if (validate.hotelId) {
    await UserModel.updateOne({ _id: user._id }, { hotelId: validate.hotelId || null });
    }
    if (validate.superAdminKey) {
      const isSuperAdminKeyValid = await user.compareSuperAdminKey(validate.superAdminKey);
      if (!isSuperAdminKeyValid) {
        return apiError(res, 400, "Invalid super admin key Please provide correct super admin key or Contact support");
      }
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    UserProfileRedis.set(`user:${user._id}`, JSON.stringify(user), "EX", 24 * 60 * 60);
    const token = user.generateJWT();
    user.refreshToken = token;
    user.role = req.body.role || user.role;
    await user.save();
    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("token", token, options);
    UserProfileRedis.set(`token:${user._id}`, token, "EX", 24 * 60 * 60 * 3); 
    return apiResponse(
      res,
      200,
      true,
      "User logged in successfully",
      {  role: user.role, token , Hotelid:user.hotelId, name: user.Name, email: user.email , superAdminKey: user.superAdminKey , id: user._id  },
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return apiError(
        res,
        400,
        "Only username and proper password is accepted",
        errors,
      );
    }
    return apiError(res, 500, "Failed to login user", error);
  }
});
const logoutUser = asyncHandler(async (req: any, res: any) => {
  const token = req.token;
  res.clearCookie("token");
  res.setHeader("Authorization", "");
  UserProfileRedis.del(`token:${req.user.id}`);
  tokenBlacklistRedis.set(`blacklist:${token || ""}`, "true", "EX", 60 * 60 * 24 * 10); // Blacklist token for 1 hour

  return apiResponse(res, 200, true, "User logged out successfully");
});
const getUserProfile = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  try {
    const result = await UserProfileRedis.get(`user:${userId}`);

    if (result) {
      const user = JSON.parse(result);

      return apiResponse(
        res,
        200,
        true,
        "User profile retrieved successfully (from cache)",
        user
      );
    }
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return apiError(res, 404, "User not found");
    }
    await UserProfileRedis.set(
      `user:${userId}`,
      JSON.stringify(user),
      "EX",
      60 * 60 * 24 * 3 // 3 days expiry
    );
    return apiResponse(
      res,
      200,
      true,
      "User profile retrieved successfully",
      user
    );
  } catch (error: any) {
    console.error("Error retrieving user profile:", error);

    return apiError(
      res,
      500,
      "Internal server error"
    );
  }
});
const updateUserProfile = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const profileImage = req.file;
  const { Name, email, number } = req.body;
  if (!Name && !email && !number && !profileImage) {
    return apiError(
      res,
      400,
      "At least one field (Name, email, number, password) must be provided for update",
    );
  }
  const user = await UserModel.findById(userId).select(
    "-password -refreshToken",
  );
  if (!user) {
    return apiError(res, 404, "User not found");
  }
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
  if (!user) {
    return apiError(res, 404, "User not found");
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  registerRedis.set(`deleteOtp:${user.email}`, otp, "EX", 10 * 60);
  try {
    deleteAccountOtpQueue.add("DeleteAccountOTP", {
      email: user.email,
      Name: user.Name.toUpperCase(),
      otp,
      subject: "OTP for Account Deletion - Travallee",
    });
  } catch (error: any) {
    console.log("error in processing OTP email for account deletion:", error);
  }
  return apiResponse(res, 200, true, "OTP sent to email for account deletion verification");
});














// not completed baniya ko kaam 

const googleAuth = asyncHandler(async (req: any, res: any) => {
  const userProfile = req.user;
  const token = userProfile.generateJWT();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };
  res.setHeader("Authorization", `Bearer ${token}`);
  res.cookie("token", token, options);
  return apiResponse(
    res,
    200,
    true,
    "Google authentication successful",
    userProfile,
  );
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
};
