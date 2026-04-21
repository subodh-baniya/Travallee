
import { apiError } from "./Utils/response/api.error.js";
import { asyncHandler } from "./Utils/asynchandler.js";
import {apiResponse} from "./Utils/response/api.response.js";
import { UserModel } from "./Model/User.model.js";
import { hotelModel } from "./Model/Hotel.model.js";
import { BannerModel } from "./Model/banner.model.js";
import {
  authenticate,
  checkRole,
  checkRoles,
  adminMiddleware,
  hotelOwnerMiddleware,
  userMiddleware,
  superAdminMiddleware,
  hotelAdminMiddleware,
  adminOrOwnerMiddleware,
  anyAuthenticatedMiddleware,
  superAdminOrHotelAdminMiddleware,
  checkOwnership,
} from "./middleware/role.middleware.js";
import { passwordCheck } from "./Utils/Func/password.js";
import {connectDB} from "./Utils/Func/connect.db.js"
import { uploadToCloudinary } from "./Utils/Func/cloudinary.js";
import { roomModel } from "./Model/Room.model.js";
import { bookingModel } from "./Model/Booking.model.js";
import {upload} from "./middleware/mullter.middleware.js";




export {
    connectDB,
    UserModel,
    apiError,
    asyncHandler,
    apiResponse,
    hotelModel,
    authenticate,
    checkRole,
    checkRoles,
    adminMiddleware,
    hotelOwnerMiddleware,
    userMiddleware,
    superAdminMiddleware,
    hotelAdminMiddleware,
    adminOrOwnerMiddleware,
    anyAuthenticatedMiddleware,
    superAdminOrHotelAdminMiddleware,
    checkOwnership,
    passwordCheck,
    roomModel,
    bookingModel,
    uploadToCloudinary,
    upload,
    BannerModel
};

