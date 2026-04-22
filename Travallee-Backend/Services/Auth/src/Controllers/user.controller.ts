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
import { Queue,  } from "bullmq";
import { redisConnection } from "../config/redis.connection.js";


const connection = redisConnection(
  process.env.REDIS_HOST as string,
  Number(process.env.REDIS_PORT),
);

const registerEmailQueue = new Queue<RegisterEmailJobData>("Register", {
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

const otpQueue = new Queue<OTPEmailJobData>("OTP", {
  connection,
});

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

    const newUser = await UserModel.create(validate);
    const userResponse = {
      id: newUser._id,
      Username: newUser.Username,
      email: newUser.email,
      Name: newUser.Name,
      role: newUser.role,
    };

    return apiResponse(
      res,
      201,
      true,
      "User registered successfully",
      userResponse,
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
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1, // 1 day
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

const sendOTP = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) {
    return apiError(res, 400, "Email is required to send OTP");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return apiError(res, 404, "User with the provided email not found");
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  user.otp = otp;
  await user.save();

  try {
    await otpQueue.add("otp", {
      email: user.email,
      Name: user.Name.toUpperCase(),
      otp: user.otp,
    });
  } catch (error) {
    console.log("error in sending email otp");
  }
  return apiResponse(res, 200, true, "OTP sent successfully to email");
});

const verifyOTP = asyncHandler(async (req: any, res: any) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return apiError(res, 400, "Email and OTP are required for verification");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return apiError(res, 404, "User with the provided email not found");
  }
  if (user.otp !== Number(otp)) {
    return apiError(
      res,
      400,
      "Invalid OTP. Please provide the correct OTP for verification.",
    );
  }
  if (user.otpExpiry && user.otpExpiry < new Date()) {
    return apiError(
      res,
      400,
      "OTP has expired. Please request a new OTP for verification.",
    );
  }
  user.otp = null;
  user.isVerified = true;
  await user.save();
   try {
      const emailData: RegisterEmailJobData = {
        userName: user.Name.toUpperCase(),
        to: user.email,
        userId: user._id.toString(),
      };
      await registerEmailQueue.add("Register", emailData);
    } catch (error) {
      console.log("error in processing email:", error);
    }

  return apiResponse(res, 200, true, "OTP verified successfully");
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

export {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  sendOTP,
  verifyOTP,
  getUserProfilePicture,
  updateUserProfilePicture,
  deleteAccount,
  history,
};
