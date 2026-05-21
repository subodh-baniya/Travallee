import {
  apiError,
  asyncHandler,
  apiResponse,
  UserModel,
  uploadToCloudinary,
  hotelModel,
  roomModel, //@ts-ignore
} from "@packages";
import { loginSchema, registerSchema } from "../Schema/user.schema.js";
import { z } from "zod";
import { Queue} from "bullmq";
import Redis from "ioredis";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
}

// @ts-ignore 
const registerRedis = new Redis(connection);

const registerEmailQueue = new Queue<RegisterEmailJobData>("Register", {
  connection,
});
const otpQueue = new Queue<OTPEmailJobData>("OTP", {
  connection,
});

interface OTPEmailJobData {
  email: string;
  Name: string;
  otp: number;
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

    const otp = Math.floor(100000 + Math.random() * 900000);
   
    registerRedis.set(`otp:${validate.email}`, otp, "EX", 10 * 60); // Store OTP in Redis with 10 minutes expiration

    try {
      otpQueue.add("SendOTP", {
        email: validate.email,
        Name: validate.Name,
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
  const { email , otp  } = req.body;
  registerRedis.get(`otp:${req.body.email}`, (err: any, result: any) => {
    if (err) {
      console.error("Error retrieving OTP from Redis:", err);
      return apiError(res, 500, "Internal server error");
    } 
   if (!result) {
      return apiError(res, 400, "OTP has expired or is invalid");
    }
    if (result !== otp) {
      return apiError(res, 400, "Invalid OTP. Please provide the correct OTP.");
    } 
    registerRedis.del(`otp:${req.body.email}`);
  });
   registerRedis.get(`pendingUser:${req.body.email}`, async (err: any, result: any) => {
    if (err) {
      console.error("Error retrieving pending user from Redis:", err);
      return apiError(res, 500, "Internal server error");
    }
    if (!result) {
      return apiError(res, 400, "No pending registration found for this email");
    }
    const userData = JSON.parse(result);
    const newUser = new UserModel(userData);
    await newUser.save();

    registerEmailQueue.add("SendWelcomeEmail", {
      userName: newUser.Name,
      to: newUser.email,
      userId: newUser._id.toString(),
    });


    registerRedis.del(`pendingUser:${req.body.email}`);
  });
  return apiResponse(res, 200, true, "OTP verified successfully");
});


const loginUser = asyncHandler(async (req: any, res: any) => {
  try {
    const validate = loginSchema.parse(req.body);
    const user = await UserModel.findOne({
      Username: validate.Username,
    });
    if (!user) {
      return apiError(res, 400, "Username don't exist");
    }
    const isPasswordValid = await user.comparePassword(validate.password);
    if (!isPasswordValid) {
      return apiError(res, 400, "Invalid password");
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    const token = user.generateJWT();
    user.refreshToken = token;
    await user.save();
    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("token", token, options);

    const userResponse = {
      id: user._id,
      Username: user.Username,
      role: user.role,
      token: token,
    };
    return apiResponse(
      res,
      200,
      true,
      "User logged in successfully",
      userResponse,
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
  res.clearCookie("token");
  res.setHeader("Authorization", "");
  return apiResponse(res, 200, true, "User logged out successfully");
});

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

const getUserProfile = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    return apiError(res, 404, "User not found");
  }
  return apiResponse(
    res,
    200,
    true,
    "User profile retrieved successfully",
    user,
  );
});

const updateUserProfile = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id ;
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

const deleteUserProfile = asyncHandler(async (req: any, res: any) => {
  const { otp } = req.body;
  const userId = req.user.id;
  const user = await UserModel.findById(userId);
  if (!user) {
    return apiError(res, 404, "User not found");
  }
  if (user.otp !== otp) {
    return apiError(
      res,
      400,
      "Invalid OTP. Please provide the correct OTP to delete your profile.",
    );
  }
  if (user.otpExpiry && user.otpExpiry < new Date()) {
    return apiError(
      res,
      400,
      "OTP has expired. Please request a new OTP to delete your profile.",
    );
  }
  await UserModel.findByIdAndDelete(userId);
  return apiResponse(res, 200, true, "User profile deleted successfully");
});



const getUserProfilePicture = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId).select("profileimage");
  if (!user) {
    return apiError(res, 404, "User not found");
  }
  return apiResponse(
    res,
    200,
    true,
    "User profile picture retrieved successfully",
    { profilePicture: user.profileimage }
  );
});






const updateUserProfilePicture = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId);
  if (!user) {
    return apiError(res, 404, "User not found");
  }
  if (!req.file) {
    return apiError(res, 400, "No file uploaded");
  }
  try {
    const result = await uploadToCloudinary(req.file.path, "profile_pictures");
    user.profileImage = result;
    await user.save();
    return apiResponse(
      res,
      200,
      true,
      "User profile picture updated successfully",
      { profilePicture: user.profileImage },
    );
  } catch (error) {
    return apiError(res, 500, "Failed to upload profile picture", error);
  }
});

const deleteAccount = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId);
  if (!user) {
    return apiError(res, 404, "User not found");
  }
  await UserModel.findByIdAndDelete(userId);
  return apiResponse(res, 200, true, "User account deleted successfully");
});

// not completed
const history = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const hotels = await hotelModel
    .find({ "bookings.user": userId })
    .select("name location");
  const rooms = await roomModel
    .find({ "bookings.user": userId })
    .select("roomNumber type");
  return apiResponse(
    res,
    200,
    true,
    "User booking history retrieved successfully",
    { hotels, rooms },
  );
});


const updateUserRole = asyncHandler(async (req: any, res: any) => {
  const { userID, role } = req.body;

  const user = await UserModel.findByIdAndUpdate(
    userID,
    { role },
    { returnDocument: "after" }
  );

  if (!user) {
    return apiError(res, 404, "User not found");
  }

  const newToken = user.generateJWT();

  return apiResponse(res, 200, true, "Role updated successfully", {
    token: newToken,
    role: user.role,
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  verifyOTP,
  getUserProfilePicture,
  updateUserProfilePicture,
  deleteAccount,
  history,
  updateUserRole
};
