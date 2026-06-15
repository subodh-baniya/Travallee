
import { asyncHandler } from "../config/asynchandler.js"
import { apiError, apiResponse } from "../config/response/api.response.js";
import { hotelModel } from "../model/Hotel.model.js"
import { roomModel } from "../model/Room.model.js"
import { uploadToCloudinary } from "../config/Func/cloudinary.js"
import type { HotelInput, RoomInput } from "../validator/hotel.validator.js";
import {
  createHotelSchema,
  createRoomSchema,
} from "../validator/hotel.validator.js";
import mongoose, { mongo } from "mongoose";
import redis from "ioredis"
import { Queue } from "bullmq";
import { createClient } from "redis";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
}
//@ts-ignore
const registerHotel = new redis(connection);
//@ts-ignore
const hoteldataCache = new redis(connection);

const registerHotelQueue = new Queue("HotelRegistration", {
  connection
});

const sub = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
const pub = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

Promise.all([sub.connect(), pub.connect()]).then(() => {
}).catch((err) => {
  console.error("Error connecting to Redis:", err);
});

sub.subscribe("bookingHistory", async (message: string) => {
  const bookingData = JSON.parse(message);
  const { hotelId } = bookingData;
  console.log("Received booking history update for hotelId:", hotelId, "with data:", bookingData);
  try {
    await hotelModel.findByIdAndUpdate(hotelId, {
      $push: {
        bookingHistory: {
          userId: bookingData.userId,
          roomId: bookingData.roomId,
          checkinDate: bookingData.checkinDate,
          checkoutDate: bookingData.checkoutDate,
          totalPrice: bookingData.totalPrice,
          paymentMethod: bookingData.paymentMethod,
          bookingPayment: bookingData.bookingPayment,
          status: bookingData.status,
          guests: bookingData.guests,
          email: bookingData.email,
        },
      },
    });
  } catch (error: any) {
    console.error("Error updating booking history:", error);
  }
});



// register and edit controller always at top please

const registerHotelRequest = asyncHandler(async (req: any, res: any) => {
  console.log(req.user);
  const userID =  req.user._id || req.user.id;
  console.log("Hotel registration request received for userID:", userID);
  const email = req.user.email;
  const files = req.files || [];

  if (!userID) {
    return apiError(res, 401, "Unauthorized: User ID not found in request");
  }

  if (files.length > 0) {
    try {
      const hotelImageUrls: string[] = [];
      const verificationDocUrls: string[] = [];

      for (const file of files) {
        // Get file path - multer stores it in 'path'
        const filePath = file.path || file.tempFilePath;

        if (!filePath) {
          console.error("File path not found", file);
          continue;
        }

        // Separate files based on field name
        if (
          file.fieldname === "VerificationDocuments" ||
          file.fieldname === "verificationDocuments"
        ) {
          const uploadResult = await uploadToCloudinary(
            filePath,
            "verification_documents",
          );
          if (uploadResult) verificationDocUrls.push(uploadResult);
        } else {
          const uploadResult = await uploadToCloudinary(
            filePath,
            "hotel_images",
          );
          if (uploadResult) hotelImageUrls.push(uploadResult);
        }
      }

      if (hotelImageUrls.length > 0) {
        req.body.hotelImages = hotelImageUrls;
      } else {
        req.body.hotelImages = [];
      }

      if (verificationDocUrls.length > 0) {
        req.body.VerificationDocuments = verificationDocUrls;
      } else {
        req.body.VerificationDocuments = [];
      }
    } catch (error: any) {
      console.error("Error uploading files:", error);
      return apiError(res, 500, "Failed to upload files", {
        error: error.message,
      });
    }
  } else {
    // Empty arrays if no files
    req.body.hotelImages = [];
    req.body.VerificationDocuments = [];
  }

  try {
    const parsedData = createHotelSchema.safeParse({...req.body, userID });
    console.log("Parsed hotel registration data:", parsedData);
    if (!parsedData.success) {
      return apiError(res, 400, "Validation failed", parsedData.error.issues);
    }
    const hotelData: HotelInput = parsedData.data;
      if (files.length > 0) {
    try {
      const hotelImageUrls: string[] = [];
      const verificationDocUrls: string[] = [];

      for (const file of files) {
        // Get file path - multer stores it in 'path'
        const filePath = file.path || file.tempFilePath;

        if (!filePath) {
          console.error("File path not found", file);
          continue;
        }

        // Separate files based on field name
        if (
          file.fieldname === "VerificationDocuments" ||
          file.fieldname === "verificationDocuments"
        ) {
          const uploadResult = await uploadToCloudinary(
            filePath,
            "verification_documents",
          );
          if (uploadResult) verificationDocUrls.push(uploadResult);
        } else {
          const uploadResult = await uploadToCloudinary(
            filePath,
            "hotel_images",
          );
          if (uploadResult) hotelImageUrls.push(uploadResult);
        }
      }

      if (hotelImageUrls.length > 0) {
        req.body.hotelImages = hotelImageUrls;
      } else {
        req.body.hotelImages = [];
      }

      if (verificationDocUrls.length > 0) {
        req.body.VerificationDocuments = verificationDocUrls;
      } else {
        req.body.VerificationDocuments = [];
      }
    } catch (error: any) {
      console.error("Error uploading files:", error);
      return apiError(res, 500, "Failed to upload files", {
        error: error.message,
      });
    }
  } else {
    // Empty arrays if no files
    req.body.hotelImages = [];
    req.body.VerificationDocuments = [];
  }
    registerHotel.set(`hotel_registration_${userID}`, JSON.stringify(hotelData), "EX", 60 * 60 * 24 * 1);// Cache for 1 day

    const emailData = {
      userID,
      hotelName: parsedData.data.hotelName,
      location: parsedData.data.hotelLocation,
      description: parsedData.data.hotelDescription,
      contactEmail: email,
      contactPhone: parsedData.data.contactNumber,
    };

    await registerHotelQueue.add("HotelRegistration", emailData);
    console.log("Published hotel registration data to queue for userID:", userID, "with data:", emailData);
    console.log( "lolde", parsedData.data);
    pub.publish("hotelRegistrationsData", JSON.stringify(parsedData.data));
    console.log("Published hotel registration data to Redis channel for userID:", userID);

    return apiResponse(
      res,
      200,
      true,
      "Hotel registration data sent to super admin. Please wait until further notice.",
      { userID }
    );


  } catch (error: any) {
    if (error.name === "ValidationError") {
      return apiError(res, 400, "Hotel validation failed", error.errors);
    }

    return apiError(
      res,
      500,
      "Internal server error: Unable to register hotel"
    );
  }
});

const createroom = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const files = req.files || [];

  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required in URL parameters");
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return apiError(res, 400, "Invalid hotel ID format");
  }

  // Verify hotel exists before attempting any uploads (avoid uploading files then failing)
  const hotel = await hotelModel.findById(hotelId);
  if (!hotel) {
    return apiError(res, 404, "Hotel not found", { hotelId });
  }

  if (files.length > 0) {
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        // Get file path - multer stores it in 'path'
        const filePath = file.path || file.tempFilePath;

        if (!filePath) {
          console.error("File path not found", file);
          continue;
        }

        const uploadResult = await uploadToCloudinary(filePath, "room_images");
        if (uploadResult) uploadedUrls.push(uploadResult);
      }
      req.body.roomImages = uploadedUrls;
    } catch (error: any) {
      console.error("Error uploading room images:", error);
      return apiError(res, 500, "Failed to upload room images", {
        error: error.message,
      });
    }
  }

  try {
    // Coerce incoming values (multipart/form fields are strings) to expected types
    const coerceRoomBody = (body: any) => {
      const out: any = { ...body, hotelId };
      const toNumber = (v: any, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
      };

      out.maxOccupancy = toNumber(body.maxOccupancy, undefined);
      out.capacity = toNumber(body.capacity, undefined);
      if (body.roomSize !== undefined) out.roomSize = toNumber(body.roomSize, undefined);
      out.floorNumber = toNumber(body.floorNumber, 0);
      out.basePrice = toNumber(body.basePrice, undefined);
      out.pricePerNight = toNumber(body.pricePerNight, undefined);
      if (body.weekendPrice !== undefined) out.weekendPrice = toNumber(body.weekendPrice, undefined);
      out.taxRate = toNumber(body.taxRate, 0);
      out.minStayNights = toNumber(body.minStayNights, 1);
      out.discount = toNumber(body.discount, 0);

      // Arrays: accept JSON string or comma-separated string
      const parseArray = (v: any) => {
        if (!v) return [];
        if (Array.isArray(v)) return v;
        if (typeof v === 'string') {
          try {
            const parsed = JSON.parse(v);
            if (Array.isArray(parsed)) return parsed;
          } catch (e) {
            return v.split(',').map((s: string) => s.trim()).filter(Boolean);
          }
        }
        return [];
      };

      out.amenities = parseArray(body.amenities);
      out.specialFeatures = parseArray(body.specialFeatures);
      out.roomImages = parseArray(body.roomImages);

      // Booleans
      const parseBool = (v: any) => {
        if (typeof v === 'boolean') return v;
        if (typeof v === 'string') return v === 'true' || v === '1';
        return Boolean(v);
      };

      out.isAccessible = parseBool(body.isAccessible);
      out.hasBathtub = parseBool(body.hasBathtub);
      out.hasShower = parseBool(body.hasShower);
      out.hasBalcony = parseBool(body.hasBalcony);
      out.hasAC = parseBool(body.hasAC);
      out.hasHeating = parseBool(body.hasHeating);
      out.hasWifi = parseBool(body.hasWifi);

      // roomImages should already be set from uploads (array of urls)
      if (!out.roomImages) out.roomImages = [];

      // Ensure required string fields exist
      out.roomNumber = body.roomNumber;
      out.roomType = body.roomType;
      out.suitetype = body.suitetype;
      out.roomDescription = body.roomDescription;
      out.cancellationPolicy = body.cancellationPolicy;

      return out;
    };

    // Validate room data (after coercion)
    const coerced = coerceRoomBody(req.body);


    const parsedData = createRoomSchema.safeParse(coerced);
    if (!parsedData.success) {
      const validationErrors = parsedData.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return apiError(res, 400, "Validation failed", validationErrors);
    }
    const roomData: RoomInput = parsedData.data;
    roomData.hotelId = hotelId;

    // Check if room with same number already exists in this hotel
    const existingRoom = await roomModel.findOne({
      hotelId: new mongoose.Types.ObjectId(hotelId),
      roomNumber: roomData.roomNumber,
    });
    console.log("Checking for existing room with number", roomData.roomNumber, "in hotel", hotelId, "Found:", !!existingRoom);

    if (existingRoom) {
      return apiError(
        res,
        409,
        "Room with this number already exists in this hotel",
      );
    }

    const response = await roomModel.create(roomData as any);
    console.log(response)

    if (!response) {
      return apiError(res, 500, "Failed to save room to database");
    }

    try {
      await hoteldataCache.del(`rooms_${hotelId}`);
    } catch (cacheErr) {
      console.error("Failed to invalidate rooms cache:", cacheErr);
    }

    return apiResponse(res, 201, true, "Room created successfully", response);
  } catch (error: any) {
    console.error("Error creating room:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.entries(error.errors).map(
        ([field, err]: any) => ({
          field,
          message: err.message,
        }),
      );
      return apiError(res, 400, "Room validation failed", validationErrors);
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return apiError(
        res,
        409,
        `Room ${field} already exists. Please use a unique value.`,
      );
    }

    // Handle other Mongoose errors
    if (error instanceof mongoose.Error.CastError) {
      return apiError(res, 400, "Invalid data format");
    }

    return apiError(
      res,
      500,
      "Internal server error: Unable to create room. Please try again later.",
    );
  }
});

const HotelData = asyncHandler(async (req: any, res: any) => {
  console.log("HotelData endpoint hit with params:", req.user);
  const { hotelId } = req.params;

  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required in URL parameters");
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return apiError(res, 400, "Invalid hotel ID format");
  }

  try {
    const cachedHotel = await registerHotel.get(`hotel_${hotelId}`);
    if (cachedHotel) {
      return apiResponse(
        res,
        200,
        true,
        "Hotel data retrieved successfully",
        JSON.parse(cachedHotel),
      );
    }

    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }

    await registerHotel.set(`hotel_${hotelId}`, JSON.stringify(hotel), "EX", 60 * 60 * 24 * 3); // Cache for 3 days

    return apiResponse(
      res,
      200,
      true,
      "Hotel data retrieved successfully",
      hotel,
    );
  } catch (error: any) {
    console.error("Error retrieving hotel data:", error);
    return apiError(res, 500, "Internal server error: Unable to retrieve hotel data");
  }
});

const syncBookingHistory = asyncHandler(async (req: any, res: any) => {
  const {
    bookingId,
    hotelId,
    userId,
    roomId,
    guestName,
    roomNumber,
    checkinDate,
    checkoutDate,
    totalPrice,
    paymentMethod,
    bookingPayment,
    status,
    guests,
    email,
    stayDurationNights,
  } = req.body || {};

  if (!hotelId || !mongoose.Types.ObjectId.isValid(hotelId)) {
    return apiError(res, 400, "Valid hotel ID is required");
  }

  try {
    const hotel = await hotelModel.findByIdAndUpdate(
      hotelId,
      {
        $push: {
          bookingHistory: {
            bookingId,
            userId,
            roomId,
            guestName,
            roomNumber,
            checkinDate,
            checkoutDate,
            totalPrice,
            stayDurationNights,
            paymentMethod,
            bookingPayment,
            status,
            guests,
            email,
          },
        },
      },
      { new: true },
    );

    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }

    return apiResponse(res, 200, true, "Booking history synced successfully", hotel.bookingHistory);
  } catch (error: any) {
    console.error("Error syncing booking history:", error);
    return apiError(res, 500, "Unable to sync booking history");
  }
});

const getBookingHistoryByHotelId = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required in URL parameters");
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return apiError(res, 400, "Invalid hotel ID format");
  }

  try {
    const hotel = await hotelModel.findById(hotelId).select("hotelName bookingHistory");

    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }

    return apiResponse(res, 200, true, "Booking history retrieved successfully", {
      hotelId,
      hotelName: hotel.hotelName,
      bookingHistory: hotel.bookingHistory || [],
    });
  } catch (error: any) {
    console.error("Error retrieving booking history:", error);
    return apiError(res, 500, "Unable to retrieve booking history");
  }
});


const RoomData = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required in URL parameters");
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return apiError(res, 400, "Invalid hotel ID format");
  }

  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalRooms = await roomModel.countDocuments({
      hotelId: new mongoose.Types.ObjectId(hotelId),
    });

    const rooms = await roomModel
      .find({ hotelId: new mongoose.Types.ObjectId(hotelId) })
      .limit(limitNum)
      .skip(skip)
      .sort({ floorNumber: 1, roomNumber: 1 });

    if (rooms.length === 0) {
      return apiError(res, 404, "No rooms found for this hotel");
    }

    return apiResponse(res, 200, true, "Rooms retrieved successfully", {
      rooms,
      pagination: {
        total: totalRooms,
        currentPage: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalRooms / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Error retrieving rooms:", error);

    if (error instanceof mongoose.Error.CastError) {
      return apiError(res, 400, "Invalid data format");
    }

    return apiError(
      res,
      500,
      "Internal server error: Unable to retrieve rooms. Please try again later.",
    );
  }
});






// app controllers
const featuredHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const cached = await hoteldataCache.get("featured_hotels");
    if (cached) {
      return apiResponse(
        res,
        200,
        true,
        "Featured hotels retrieved successfully (cached)",
        JSON.parse(cached),
      );
    }
    const hotels = await hotelModel.find({ isFeatured: true });
    if (hotels.length === 0) {
      return apiError(res, 404, "No featured hotels found");
    }
    await hoteldataCache.set("featured_hotels", JSON.stringify(hotels), "EX", 60 * 60);
    return apiResponse(
      res,
      200,
      true,
      "Featured hotels retrieved successfully",
      hotels,
    );
  } catch (error) {
    return apiError(res, 500, "Internal server error");
  }
});

const searchHotels = asyncHandler(async (req: any, res: any) => {
  // query = name
  const { query, location, page = 1, limit = 10 } = req.query;

  if (!query && !location) {
    return apiError(res, 400, "Search query or location is required");
  }

  try {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const searchFilter: any = {};

    if (query) {
      searchFilter.$or = [
        { hotelName: { $regex: query, $options: "i" } },
        { hotelDescription: { $regex: query, $options: "i" } },
      ];
    }

    if (location) {
      searchFilter.hotelLocation = { $regex: location, $options: "i" };
    }

    const totalHotels = await hotelModel.countDocuments(searchFilter);

    // Get paginated results
    const hotels = await hotelModel
      .find(searchFilter)
      .limit(limitNum)
      .skip(skip)
      .select(
        "hotelName hotelLocation hotelImages propertyType rating numberOfReviews isFeatured",
      )
      .sort({ rating: -1, numberOfReviews: -1 });

    if (hotels.length === 0) {
      return apiError(res, 404, "No hotels found matching your search");
    }

    return apiResponse(res, 200, true, "Hotels found successfully", {
      hotels,
      pagination: {
        total: totalHotels,
        currentPage: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalHotels / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Error searching hotels:", error);
    return apiError(res, 500, "Internal server error: Unable to search hotels");
  }
});

const searchRooms = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const {
    query,
    roomType,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = req.query;

  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required in URL parameters");
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return apiError(res, 400, "Invalid hotel ID format");
  }

  if (!query && !roomType) {
    return apiError(res, 400, "Search query or room type is required");
  }

  try {
    // Verify hotel exists
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build search filter
    const searchFilter: any = {
      hotelId: new mongoose.Types.ObjectId(hotelId),
    };

    if (query) {
      // Case-insensitive search in room number, type, and description
      searchFilter.$or = [
        { roomNumber: { $regex: query, $options: "i" } },
        { roomType: { $regex: query, $options: "i" } },
        { roomDescription: { $regex: query, $options: "i" } },
        { amenities: { $in: [new RegExp(query, "i")] } },
      ];
    }

    if (roomType) {
      searchFilter.roomType = { $regex: roomType, $options: "i" };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      searchFilter.pricePerNight = {};
      if (minPrice) searchFilter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) searchFilter.pricePerNight.$lte = parseFloat(maxPrice);
    }

    // Get total count
    const totalRooms = await roomModel.countDocuments(searchFilter);

    // Get paginated results
    const rooms = await roomModel
      .find(searchFilter)
      .limit(limitNum)
      .skip(skip)
      .select(
        "roomNumber roomType pricePerNight capacity amenities roomImages rating",
      )
      .sort({ floorNumber: 1, roomNumber: 1 });

    if (rooms.length === 0) {
      return apiError(res, 404, "No rooms found matching your search");
    }

    return apiResponse(res, 200, true, "Rooms found successfully", {
      rooms,
      pagination: {
        total: totalRooms,
        currentPage: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalRooms / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Error searching rooms:", error);

    if (error instanceof mongoose.Error.CastError) {
      return apiError(res, 400, "Invalid data format");
    }

    return apiError(res, 500, "Internal server error: Unable to search rooms");
  }
});

const getHotelInfo = asyncHandler(async (req: any, res: any) => {

  const userId = req.user?.id || req.user?._id;
  if (!userId) {
    return apiError(res, 401, "User not authenticated");
  }

  try {
    const cachedHotel = await hoteldataCache.get(`hotel_${userId}`);
    if (cachedHotel) {
      return apiResponse(
        res,
        200,
        true,
        "Hotel information retrieved from cache",
        JSON.parse(cachedHotel)
      );
    }
  } catch (error) {
    console.error("Error accessing hotel data cache:", error);
  }
  const hotelData = await hotelModel.findOne({
    userID: new mongo.ObjectId(userId),
  });
  if (!hotelData) {
    const allHotels = await hotelModel.find({});
    return apiError(res, 404, "Hotel not found for this user");
  }

  hoteldataCache.set(`hotel_${hotelData._id}`, JSON.stringify(hotelData), "EX", 60 * 60 * 24 * 3); // Cache for 3 days

  apiResponse(
    res,
    200,
    true,
    "Hotel information retrieved successfully",
    hotelData,
  );
});

const highReviewedHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const cached = await hoteldataCache.get("high_reviewed_hotels");
    if (cached) {
      return apiResponse(
        res,
        200,
        true,
        "Highly reviewed hotels retrieved successfully (cached)",
        JSON.parse(cached),
      );
    }
    const hotels = await hotelModel
      .find({ rating: { $gte: 4.0 } })
      .select(
        "hotelName hotelLocation hotelImages propertyType rating numberOfReviews isFeatured",
      )
      .sort({ rating: -1, numberOfReviews: -1 });

    if (hotels.length === 0) {
      return apiError(res, 404, "No highly reviewed hotels found");
    }
    await hoteldataCache.set("high_reviewed_hotels", JSON.stringify(hotels), "EX", 60 * 60);
    return apiResponse(
      res,
      200,
      true,
      "Highly reviewed hotels retrieved successfully",
      hotels,
    );
  } catch (error: any) {
    console.error("Error in highReviewedHotels:", error);
    return apiError(res, 500, "Internal server error: " + error.message);
  }
});

const getAllHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const cached = await hoteldataCache.get("all_hotels");
    if (cached) {
      return apiResponse(
        res,
        200,
        true,
        "Hotels retrieved successfully (cached)",
        JSON.parse(cached),
      );
    }
    const hotels = await hotelModel.find({}).limit(10);
    if (hotels.length === 0) {
      console.log("No active hotels found in database");
      return apiResponse(res, 200, true, "No hotels available", []);
    }
    console.log(`Retrieved ${hotels.length} hotels`);
    await hoteldataCache.set("all_hotels", JSON.stringify(hotels), "EX", 60 * 60);
    return apiResponse(res, 200, true, "Hotels retrieved successfully", hotels);
  } catch (error: any) {
    console.error("Error fetching hotels:", error.message);
    return apiError(res, 500, "Failed to fetch hotels: " + error.message);
  }
});

const getAllResortHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const cached = await hoteldataCache.get("all_resort_hotels");
    if (cached) {
      return apiResponse(
        res,
        200,
        true,
        "Resort hotels retrieved successfully (cached)",
        JSON.parse(cached),
      );
    }
    const hotels = await hotelModel.find({ propertyType: "Resort", isactive: true }).limit(10);
    if (hotels.length === 0) {
      console.log("No active resorts found in database");
      return apiResponse(res, 200, true, "No resorts available", []);
    }
    console.log(`Retrieved ${hotels.length} resorts`);
    await hoteldataCache.set("all_resort_hotels", JSON.stringify(hotels), "EX", 60 * 60);
    return apiResponse(res, 200, true, "Resort hotels retrieved successfully", hotels);
  } catch (error: any) {
    console.error("Error fetching resorts:", error.message);
    return apiError(res, 500, "Failed to fetch resorts: " + error.message);
  }
});


const displayRooms = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  try {
    const cached = await hoteldataCache.get(`rooms_${hotelId}`);
    if (cached) {
      return apiResponse(
        res,
        200,
        true,
        "Rooms retrieved successfully (cached)",
        JSON.parse(cached),
      );
    }
    const rooms = await roomModel.find({ hotelId });
    if (rooms.length === 0) {
      return apiError(res, 404, "No rooms found for this hotel");
    }
    await hoteldataCache.set(`rooms_${hotelId}`, JSON.stringify(rooms), "EX", 60 * 60);
    return apiResponse(res, 200, true, "Rooms retrieved successfully", rooms);
  } catch (error: any) {
    return apiError(res, 500, "Internal server error: Unable to retrieve rooms. Please try again later.", error.message);
  }
});

const getHotelByLocation = asyncHandler(async (req: any, res: any) => {
  const { location } = req.params;
  if (!location) {
    return apiError(res, 400, "Location parameter is required");
  }
  try {
    const hotels = await hotelModel.find({
      hotelLocation: { $regex: location, $options: "i" },
    }).select(
      "hotelName hotelLocation hotelImages propertyType rating numberOfReviews isFeatured"
    );
    if (hotels.length === 0) {
      return apiError(res, 404, "No hotels found in this location");
    }
    return apiResponse(res, 200, true, "Hotels retrieved successfully", hotels);
  } catch (error: any) {
    console.error("Error fetching hotels by location:", error);
    return apiError(res, 500, "Internal server error: Unable to fetch hotels by location");
  }
});

const getAllRatings = asyncHandler(async (req: any, res: any) => {
  const cached =  await hoteldataCache.get(`hotel_${req.params.hotelId}_ratings`);
  if (cached) {
   const data = JSON.parse(cached);
   return apiResponse(res, 200, true, "Ratings retrieved successfully", data);
  }
  const { hotelId } = req.params;
  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required in URL parameters");
  }
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return apiError(res, 400, "Invalid hotel ID format");
  }
  try {
    const hotel = await hotelModel.findById(hotelId).select("ratings");
    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }
    hoteldataCache.set(`hotel_${hotelId}_ratings`, JSON.stringify(hotel|| []), "EX", 60 * 60 * 24 * 1); // Cache for 1 day
    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }
    return apiResponse(res, 200, true, "Ratings retrieved successfully", hotel || []);
  } catch (error: any) {
    console.error("Error retrieving ratings:", error);
    return apiError(res, 500, "Unable to retrieve ratings");
  }
});

const getPaymentCredentials = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required in URL parameters");
  }
  const hotel=await hotelModel.findById(hotelId).select("esewa_Merchantid khalti_SecretKey hoteName");

  if (!hotel) {
    return apiError(res, 404, "Hotel not found");
  }
  return apiResponse(res, 200, true, "Payment credentials retrieved successfully", {
    "esewa_Merchantid": hotel.esewa_Merchantid,
    "khalti_SecretKey": hotel.khalti_SecretKey,
    "hotelName": hotel.hotelName,
  });

});


const approveRegistration = asyncHandler(async (req: any, res: any) => {
  const { userID } = req.body;
  if (!userID) {
    return apiError(res, 400, "User ID is required");
  }

  try {
    const cachedData = await registerHotel.get(`hotel_registration_${userID}`);
    if (!cachedData) {
      return apiError(res, 404, "Registration request not found or expired");
    }

    const hotelData = JSON.parse(cachedData);
    hotelData.isactive = true;
    hotelData.verified = true;

    const newHotel = new hotelModel(hotelData);
    await newHotel.save();

    await registerHotel.del(`hotel_registration_${userID}`);

    // Clear list caches
    await hoteldataCache.del("featured_hotels");
    await hoteldataCache.del("high_reviewed_hotels");
    await hoteldataCache.del("all_hotels");
    await hoteldataCache.del("all_resort_hotels");

    return apiResponse(res, 200, true, "Hotel registration approved and created successfully", newHotel);
  } catch (error: any) {
    console.error("Error approving hotel registration:", error);
    return apiError(res, 500, "Internal server error: Unable to approve registration");
  }
});

const declineRegistration = asyncHandler(async (req: any, res: any) => {
  const { userID } = req.body;
  if (!userID) {
    return apiError(res, 400, "User ID is required");
  }

  try {
    await registerHotel.del(`hotel_registration_${userID}`);
    return apiResponse(res, 200, true, "Hotel registration declined successfully");
  } catch (error: any) {
    console.error("Error declining hotel registration:", error);
    return apiError(res, 500, "Internal server error: Unable to decline registration");
  }
});

export {
  registerHotelRequest,
  createroom,
  // deleteRoom,
  featuredHotels,
  HotelData,
  syncBookingHistory,
  getBookingHistoryByHotelId,
  RoomData,
  searchHotels,
  searchRooms,
  getHotelInfo,
  highReviewedHotels,
  getAllHotels,
  getAllResortHotels,
  displayRooms,
  getHotelByLocation,
  getPaymentCredentials,
  getAllRatings,
  approveRegistration,
  declineRegistration,
};

