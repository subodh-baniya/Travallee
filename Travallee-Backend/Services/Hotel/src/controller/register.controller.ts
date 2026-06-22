import { asyncHandler } from "../config/asynchandler.js"
import { apiError, apiResponse } from "../config/response/api.response.js";
import { hotelModel } from "../model/Hotel.model.js"
import { roomModel } from "../model/Room.model.js"
import { uploadToCloudinary } from "../config/Func/cloudinary.js"
import type { HotelInput, RoomInput } from "../validator/hotel.validator.js";
import { createHotelSchema, createRoomSchema } from "../validator/hotel.validator.js";
import mongoose, { mongo } from "mongoose";
import { Queue } from "bullmq";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
  throw new Error("Missing Redis environment variables: REDIS_HOST, REDIS_PORT, REDIS_PASSWORD");
}

const redisUrl = `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const registerHotel = createClient({ url: redisUrl });
const hoteldataCache = createClient({ url: redisUrl });
const sub = createClient({ url: redisUrl });
const pub = createClient({ url: redisUrl });

registerHotel.on("error", (err) => console.error("registerHotel error:", err.message));
hoteldataCache.on("error", (err) => console.error("hoteldataCache error:", err.message));
sub.on("error", (err) => console.error("sub error:", err.message));
pub.on("error", (err) => console.error("pub error:", err.message));

Promise.all([
  registerHotel.connect(),
  hoteldataCache.connect(),
  sub.connect(),
  pub.connect(),
]).then(() => console.log("All Redis clients connected ✓"))
  .catch((err) => { throw new Error("Redis connection failed: " + err.message); });

const bullConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME || "default",
};

const registerHotelQueue = new Queue("HotelRegistration", { connection: bullConnection });

sub.subscribe("bookingHistory", async (message: string) => {
  const bookingData = JSON.parse(message);
  const { hotelId } = bookingData;
  console.log("Received booking history update for hotelId:", hotelId);
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

// ─── Controllers ────────────────────────────────────────────────────────────

const registerHotelRequest = asyncHandler(async (req: any, res: any) => {
  const userID = req.user._id || req.user.id;
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
        const filePath = file.path || file.tempFilePath;
        if (!filePath) { console.error("File path not found", file); continue; }

        if (file.fieldname === "VerificationDocuments" || file.fieldname === "verificationDocuments") {
          const uploadResult = await uploadToCloudinary(filePath, "verification_documents");
          if (uploadResult) verificationDocUrls.push(uploadResult);
        } else {
          const uploadResult = await uploadToCloudinary(filePath, "hotel_images");
          if (uploadResult) hotelImageUrls.push(uploadResult);
        }
      }

      req.body.hotelImages = hotelImageUrls.length > 0 ? hotelImageUrls : [];
      req.body.VerificationDocuments = verificationDocUrls.length > 0 ? verificationDocUrls : [];
    } catch (error: any) {
      console.error("Error uploading files:", error);
      return apiError(res, 500, "Failed to upload files", { error: error.message });
    }
  } else {
    req.body.hotelImages = [];
    req.body.VerificationDocuments = [];
  }

  try {
    const parsedData = createHotelSchema.safeParse({ ...req.body, userID });
    if (!parsedData.success) {
      return apiError(res, 400, "Validation failed", parsedData.error.issues);
    }

    const emailData = {
      userID,
      hotelName: parsedData.data.hotelName,
      location: parsedData.data.hotelLocation,
      description: parsedData.data.hotelDescription,
      contactEmail: email,
      contactPhone: parsedData.data.contactNumber,
    };

    await registerHotelQueue.add("HotelRegistration", emailData);
    await registerHotel.set(`hotel_registration_${userID}`, JSON.stringify(parsedData.data), { EX: 60 * 60 * 24 });
    await pub.publish("hotelRegistrationsData", JSON.stringify(parsedData.data));

    console.log("Hotel registration queued for userID:", userID);

    return apiResponse(res, 200, true, "Hotel registration data sent to super admin. Please wait until further notice.", { userID });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return apiError(res, 400, "Hotel validation failed", error.errors);
    }
    return apiError(res, 500, "Internal server error: Unable to register hotel");
  }
});

const createroom = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const files = req.files || [];

  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Invalid hotel ID format");

  const hotel = await hotelModel.findById(hotelId);
  if (!hotel) return apiError(res, 404, "Hotel not found", { hotelId });

  if (files.length > 0) {
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const filePath = file.path || file.tempFilePath;
        if (!filePath) { console.error("File path not found", file); continue; }
        const uploadResult = await uploadToCloudinary(filePath, "room_images");
        if (uploadResult) uploadedUrls.push(uploadResult);
      }
      req.body.roomImages = uploadedUrls;
    } catch (error: any) {
      console.error("Error uploading room images:", error);
      return apiError(res, 500, "Failed to upload room images", { error: error.message });
    }
  }

  try {
    const coerceRoomBody = (body: any) => {
      const out: any = { ...body, hotelId };
      const toNumber = (v: any, fallback?: number) => { const n = Number(v); return Number.isFinite(n) ? n : fallback; };
      const parseArray = (v: any) => {
        if (!v) return [];
        if (Array.isArray(v)) return v;
        if (typeof v === "string") {
          try { const p = JSON.parse(v); if (Array.isArray(p)) return p; } catch { return v.split(",").map((s: string) => s.trim()).filter(Boolean); }
        }
        return [];
      };
      const parseBool = (v: any) => { if (typeof v === "boolean") return v; if (typeof v === "string") return v === "true" || v === "1"; return Boolean(v); };

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
      out.amenities = parseArray(body.amenities);
      out.specialFeatures = parseArray(body.specialFeatures);
      out.roomImages = parseArray(body.roomImages);
      out.isAccessible = parseBool(body.isAccessible);
      out.hasBathtub = parseBool(body.hasBathtub);
      out.hasShower = parseBool(body.hasShower);
      out.hasBalcony = parseBool(body.hasBalcony);
      out.hasAC = parseBool(body.hasAC);
      out.hasHeating = parseBool(body.hasHeating);
      out.hasWifi = parseBool(body.hasWifi);
      if (!out.roomImages) out.roomImages = [];
      out.roomNumber = body.roomNumber;
      out.roomType = body.roomType;
      out.suitetype = body.suitetype;
      out.roomDescription = body.roomDescription;
      out.cancellationPolicy = body.cancellationPolicy;
      return out;
    };

    const coerced = coerceRoomBody(req.body);
    const parsedData = createRoomSchema.safeParse(coerced);
    if (!parsedData.success) {
      return apiError(res, 400, "Validation failed", parsedData.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })));
    }

    const roomData: RoomInput = parsedData.data;
    roomData.hotelId = hotelId;

    const existingRoom = await roomModel.findOne({ hotelId: new mongoose.Types.ObjectId(hotelId), roomNumber: roomData.roomNumber });
    if (existingRoom) return apiError(res, 409, "Room with this number already exists in this hotel");

    const response = await roomModel.create(roomData as any);
    if (!response) return apiError(res, 500, "Failed to save room to database");

    try { await hoteldataCache.del(`rooms_${hotelId}`); } catch (e) { console.error("Cache invalidation failed:", e); }

    return apiResponse(res, 201, true, "Room created successfully", response);
  } catch (error: any) {
    console.error("Error creating room:", error);
    if (error.name === "ValidationError") {
      return apiError(res, 400, "Room validation failed", Object.entries(error.errors).map(([field, err]: any) => ({ field, message: err.message })));
    }
    if (error.code === 11000) return apiError(res, 409, `Room ${Object.keys(error.keyPattern)[0]} already exists.`);
    if (error instanceof mongoose.Error.CastError) return apiError(res, 400, "Invalid data format");
    return apiError(res, 500, "Internal server error: Unable to create room.");
  }
});

const HotelData = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;

  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Invalid hotel ID format");

  try {
    const cachedHotel = await registerHotel.get(`hotel_${hotelId}`);
    if (cachedHotel) return apiResponse(res, 200, true, "Hotel data retrieved successfully", JSON.parse(cachedHotel));

    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) return apiError(res, 404, "Hotel not found", { hotelId });

    await registerHotel.set(`hotel_${hotelId}`, JSON.stringify(hotel), { EX: 60 * 60 * 24 * 3 });
    return apiResponse(res, 200, true, "Hotel data retrieved successfully", hotel);
  } catch (error: any) {
    console.error("Error retrieving hotel data:", error);
    return apiError(res, 500, "Internal server error: Unable to retrieve hotel data");
  }
});

const syncBookingHistory = asyncHandler(async (req: any, res: any) => {
  const { bookingId, hotelId, userId, roomId, guestName, roomNumber, checkinDate, checkoutDate, totalPrice, paymentMethod, bookingPayment, status, guests, email, stayDurationNights } = req.body || {};

  if (!hotelId || !mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Valid hotel ID is required");

  try {
    const updateResult = await hotelModel.updateOne(
      { _id: hotelId, "bookingHistory.bookingId": bookingId },
      { $set: { "bookingHistory.$.userId": userId, "bookingHistory.$.roomId": roomId, "bookingHistory.$.guestName": guestName, "bookingHistory.$.roomNumber": roomNumber, "bookingHistory.$.checkinDate": checkinDate, "bookingHistory.$.checkoutDate": checkoutDate, "bookingHistory.$.totalPrice": totalPrice, "bookingHistory.$.stayDurationNights": stayDurationNights, "bookingHistory.$.paymentMethod": paymentMethod, "bookingHistory.$.bookingPayment": bookingPayment, "bookingHistory.$.status": status, "bookingHistory.$.guests": guests, "bookingHistory.$.email": email } }
    );

    let hotel;
    if (updateResult.matchedCount > 0) {
      hotel = await hotelModel.findById(hotelId).select("bookingHistory");
    } else {
      hotel = await hotelModel.findByIdAndUpdate(hotelId, { $push: { bookingHistory: { bookingId, userId, roomId, guestName, roomNumber, checkinDate, checkoutDate, totalPrice, stayDurationNights, paymentMethod, bookingPayment, status, guests, email } } }, { new: true });
    }

    if (!hotel) return apiError(res, 404, "Hotel not found", { hotelId });
    return apiResponse(res, 200, true, "Booking history synced successfully", hotel.bookingHistory);
  } catch (error: any) {
    console.error("Error syncing booking history:", error);
    return apiError(res, 500, "Unable to sync booking history");
  }
});

const getBookingHistoryByHotelId = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;

  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Invalid hotel ID format");

  try {
    const hotel = await hotelModel.findById(hotelId).select("hotelName bookingHistory");
    if (!hotel) return apiError(res, 404, "Hotel not found", { hotelId });
    return apiResponse(res, 200, true, "Booking history retrieved successfully", { hotelId, hotelName: hotel.hotelName, bookingHistory: hotel.bookingHistory || [] });
  } catch (error: any) {
    console.error("Error retrieving booking history:", error);
    return apiError(res, 500, "Unable to retrieve booking history");
  }
});

const RoomData = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Invalid hotel ID format");

  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) return apiError(res, 404, "Hotel not found", { hotelId });

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalRooms = await roomModel.countDocuments({ hotelId: new mongoose.Types.ObjectId(hotelId) });
    const rooms = await roomModel.find({ hotelId: new mongoose.Types.ObjectId(hotelId) }).limit(limitNum).skip(skip).sort({ floorNumber: 1, roomNumber: 1 });

    if (rooms.length === 0) return apiError(res, 404, "No rooms found for this hotel");
    return apiResponse(res, 200, true, "Rooms retrieved successfully", { rooms, pagination: { total: totalRooms, currentPage: pageNum, limit: limitNum, totalPages: Math.ceil(totalRooms / limitNum) } });
  } catch (error: any) {
    console.error("Error retrieving rooms:", error);
    if (error instanceof mongoose.Error.CastError) return apiError(res, 400, "Invalid data format");
    return apiError(res, 500, "Internal server error: Unable to retrieve rooms.");
  }
});

const featuredHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const cached = await hoteldataCache.get("featured_hotels");
    if (cached) return apiResponse(res, 200, true, "Featured hotels retrieved successfully (cached)", JSON.parse(cached));

    const hotels = await hotelModel.find({ isFeatured: true });
    if (hotels.length === 0) return apiError(res, 404, "No featured hotels found");

    await hoteldataCache.set("featured_hotels", JSON.stringify(hotels), { EX: 60 * 60 });
    return apiResponse(res, 200, true, "Featured hotels retrieved successfully", hotels);
  } catch (error) {
    return apiError(res, 500, "Internal server error");
  }
});

const searchHotels = asyncHandler(async (req: any, res: any) => {
  const { query, location, page = 1, limit = 10 } = req.query;

  if (!query && !location) return apiError(res, 400, "Search query or location is required");

  try {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;
    const searchFilter: any = {};

    if (query) searchFilter.$or = [{ hotelName: { $regex: query, $options: "i" } }, { hotelDescription: { $regex: query, $options: "i" } }];
    if (location) searchFilter.hotelLocation = { $regex: location, $options: "i" };

    const totalHotels = await hotelModel.countDocuments(searchFilter);
    const hotels = await hotelModel.find(searchFilter).limit(limitNum).skip(skip).select("hotelName hotelLocation hotelImages propertyType rating numberOfReviews isFeatured").sort({ rating: -1, numberOfReviews: -1 });

    if (hotels.length === 0) return apiError(res, 404, "No hotels found matching your search");
    return apiResponse(res, 200, true, "Hotels found successfully", { hotels, pagination: { total: totalHotels, currentPage: pageNum, limit: limitNum, totalPages: Math.ceil(totalHotels / limitNum) } });
  } catch (error: any) {
    console.error("Error searching hotels:", error);
    return apiError(res, 500, "Internal server error: Unable to search hotels");
  }
});

const searchRooms = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const { query, roomType, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Invalid hotel ID format");
  if (!query && !roomType) return apiError(res, 400, "Search query or room type is required");

  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) return apiError(res, 404, "Hotel not found", { hotelId });

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;
    const searchFilter: any = { hotelId: new mongoose.Types.ObjectId(hotelId) };

    if (query) searchFilter.$or = [{ roomNumber: { $regex: query, $options: "i" } }, { roomType: { $regex: query, $options: "i" } }, { roomDescription: { $regex: query, $options: "i" } }, { amenities: { $in: [new RegExp(query, "i")] } }];
    if (roomType) searchFilter.roomType = { $regex: roomType, $options: "i" };
    if (minPrice || maxPrice) {
      searchFilter.pricePerNight = {};
      if (minPrice) searchFilter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) searchFilter.pricePerNight.$lte = parseFloat(maxPrice);
    }

    const totalRooms = await roomModel.countDocuments(searchFilter);
    const rooms = await roomModel.find(searchFilter).limit(limitNum).skip(skip).select("roomNumber roomType pricePerNight capacity amenities roomImages rating").sort({ floorNumber: 1, roomNumber: 1 });

    if (rooms.length === 0) return apiError(res, 404, "No rooms found matching your search");
    return apiResponse(res, 200, true, "Rooms found successfully", { rooms, pagination: { total: totalRooms, currentPage: pageNum, limit: limitNum, totalPages: Math.ceil(totalRooms / limitNum) } });
  } catch (error: any) {
    console.error("Error searching rooms:", error);
    if (error instanceof mongoose.Error.CastError) return apiError(res, 400, "Invalid data format");
    return apiError(res, 500, "Internal server error: Unable to search rooms");
  }
});

const getHotelInfo = asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id || req.user?._id;
  if (!userId) return apiError(res, 401, "User not authenticated");

  try {
    const cachedHotel = await hoteldataCache.get(`hotel_${userId}`);
    if (cachedHotel) return apiResponse(res, 200, true, "Hotel information retrieved from cache", JSON.parse(cachedHotel));
  } catch (error) {
    console.error("Error accessing hotel data cache:", error);
  }

  const hotelData = await hotelModel.findOne({ userID: new mongo.ObjectId(userId) });
  if (!hotelData) return apiError(res, 404, "Hotel not found for this user");

  await hoteldataCache.set(`hotel_${hotelData._id}`, JSON.stringify(hotelData), { EX: 60 * 60 * 24 * 3 });
  return apiResponse(res, 200, true, "Hotel information retrieved successfully", hotelData);
});

const highReviewedHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const cached = await hoteldataCache.get("high_reviewed_hotels");
    if (cached) return apiResponse(res, 200, true, "Highly reviewed hotels retrieved successfully (cached)", JSON.parse(cached));

    const hotels = await hotelModel.find({ rating: { $gte: 4.0 } }).select("hotelName hotelLocation hotelImages propertyType rating numberOfReviews isFeatured").sort({ rating: -1, numberOfReviews: -1 });
    if (hotels.length === 0) return apiError(res, 404, "No highly reviewed hotels found");

    await hoteldataCache.set("high_reviewed_hotels", JSON.stringify(hotels), { EX: 60 * 60 });
    return apiResponse(res, 200, true, "Highly reviewed hotels retrieved successfully", hotels);
  } catch (error: any) {
    console.error("Error in highReviewedHotels:", error);
    return apiError(res, 500, "Internal server error: " + error.message);
  }
});

const getAllHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const cached = await hoteldataCache.get("all_hotels");
    if (cached) return apiResponse(res, 200, true, "Hotels retrieved successfully (cached)", JSON.parse(cached));

    const hotels = await hotelModel.find({}).limit(10);
    if (hotels.length === 0) return apiResponse(res, 200, true, "No hotels available", []);

    await hoteldataCache.set("all_hotels", JSON.stringify(hotels), { EX: 60 * 60 });
    return apiResponse(res, 200, true, "Hotels retrieved successfully", hotels);
  } catch (error: any) {
    console.error("Error fetching hotels:", error.message);
    return apiError(res, 500, "Failed to fetch hotels: " + error.message);
  }
});

const getAllResortHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const cached = await hoteldataCache.get("all_resort_hotels");
    if (cached) return apiResponse(res, 200, true, "Resort hotels retrieved successfully (cached)", JSON.parse(cached));

    const hotels = await hotelModel.find({ propertyType: "Resort", isactive: true }).limit(10);
    if (hotels.length === 0) return apiResponse(res, 200, true, "No resorts available", []);

    await hoteldataCache.set("all_resort_hotels", JSON.stringify(hotels), { EX: 60 * 60 });
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
    if (cached) return apiResponse(res, 200, true, "Rooms retrieved successfully (cached)", JSON.parse(cached));

    const rooms = await roomModel.find({ hotelId });
    if (rooms.length === 0) return apiError(res, 404, "No rooms found for this hotel");

    await hoteldataCache.set(`rooms_${hotelId}`, JSON.stringify(rooms), { EX: 60 * 60 });
    return apiResponse(res, 200, true, "Rooms retrieved successfully", rooms);
  } catch (error: any) {
    return apiError(res, 500, "Internal server error: Unable to retrieve rooms.", error.message);
  }
});

const getHotelByLocation = asyncHandler(async (req: any, res: any) => {
  const { location } = req.params;
  if (!location) return apiError(res, 400, "Location parameter is required");

  try {
    const hotels = await hotelModel.find({ hotelLocation: { $regex: location, $options: "i" } }).select("hotelName hotelLocation hotelImages propertyType rating numberOfReviews isFeatured");
    if (hotels.length === 0) return apiError(res, 404, "No hotels found in this location");
    return apiResponse(res, 200, true, "Hotels retrieved successfully", hotels);
  } catch (error: any) {
    console.error("Error fetching hotels by location:", error);
    return apiError(res, 500, "Internal server error: Unable to fetch hotels by location");
  }
});

const getAllRatings = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;

  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Invalid hotel ID format");

  try {
    const cached = await hoteldataCache.get(`hotel_${hotelId}_ratings`);
    if (cached) return apiResponse(res, 200, true, "Ratings retrieved successfully", JSON.parse(cached));

    const hotel = await hotelModel.findById(hotelId).select("ratings");
    if (!hotel) return apiError(res, 404, "Hotel not found", { hotelId });

    await hoteldataCache.set(`hotel_${hotelId}_ratings`, JSON.stringify(hotel), { EX: 60 * 60 * 24 });
    return apiResponse(res, 200, true, "Ratings retrieved successfully", hotel);
  } catch (error: any) {
    console.error("Error retrieving ratings:", error);
    return apiError(res, 500, "Unable to retrieve ratings");
  }
});

const getPaymentCredentials = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");

  const hotel = await hotelModel.findById(hotelId).select("esewa_Merchantid khalti_SecretKey hotelName");
  if (!hotel) return apiError(res, 404, "Hotel not found");

  return apiResponse(res, 200, true, "Payment credentials retrieved successfully", {
    esewa_Merchantid: hotel.esewa_Merchantid,
    khalti_SecretKey: hotel.khalti_SecretKey,
    hotelName: hotel.hotelName,
  });
});

const approveRegistration = asyncHandler(async (req: any, res: any) => {
  const { userID } = req.body;
  if (!userID) return apiError(res, 400, "User ID is required");

  try {
    const cachedData = await registerHotel.get(`hotel_registration_${userID}`);
    if (!cachedData) return apiError(res, 404, "Registration request not found or expired");

    const hotelData = JSON.parse(cachedData);
    hotelData.isactive = true;
    hotelData.verified = true;

    const newHotel = new hotelModel(hotelData);
    await newHotel.save();

    await registerHotel.del(`hotel_registration_${userID}`);
    await Promise.all([
      hoteldataCache.del("featured_hotels"),
      hoteldataCache.del("high_reviewed_hotels"),
      hoteldataCache.del("all_hotels"),
      hoteldataCache.del("all_resort_hotels"),
    ]);

    await pub.publish("newHotelApproved", JSON.stringify({ userID, hotelId: newHotel._id }));
    console.log("Hotel approved for userID:", userID, "hotelId:", newHotel._id);

    return apiResponse(res, 200, true, "Hotel registration approved and created successfully", newHotel);
  } catch (error: any) {
    console.error("Error approving hotel registration:", error);
    return apiError(res, 500, "Internal server error: Unable to approve registration");
  }
});

const declineRegistration = asyncHandler(async (req: any, res: any) => {
  const { userID } = req.body;
  if (!userID) return apiError(res, 400, "User ID is required");

  try {
    await registerHotel.del(`hotel_registration_${userID}`);
    return apiResponse(res, 200, true, "Hotel registration declined successfully");
  } catch (error: any) {
    console.error("Error declining hotel registration:", error);
    return apiError(res, 500, "Internal server error: Unable to decline registration");
  }
});

const updateHotelInfo = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");

  try {
    const updatedHotel = await hotelModel.findByIdAndUpdate(hotelId, { $set: req.body }, { new: true, runValidators: true });
    if (!updatedHotel) return apiError(res, 404, "Hotel not found", { hotelId });

    await Promise.all([
      hoteldataCache.del(`hotel_${hotelId}`),
      registerHotel.del(`hotel_${hotelId}`),
      hoteldataCache.del(`hotel_user_${updatedHotel.userID}`),
      hoteldataCache.del("all_hotels"),
      hoteldataCache.del("featured_hotels"),
      hoteldataCache.del("high_reviewed_hotels"),
      hoteldataCache.del("all_resort_hotels"),
    ]);

    return apiResponse(res, 200, true, "Hotel information updated successfully", updatedHotel);
  } catch (error: any) {
    console.error("Error updating hotel information:", error);
    return apiError(res, 500, "Internal server error: Unable to update hotel information");
  }
});

const updateHotelGallery = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const files = req.files || [];

  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Invalid hotel ID format");
  if (files.length === 0) return apiError(res, 400, "No images provided for gallery update");

  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) return apiError(res, 404, "Hotel not found", { hotelId });

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const filePath = file.path || file.tempFilePath;
      if (!filePath) { console.error("File path not found", file); continue; }
      const uploadResult = await uploadToCloudinary(filePath, "hotel_images");
      if (uploadResult) uploadedUrls.push(uploadResult);
    }

    if (uploadedUrls.length === 0) return apiError(res, 500, "Failed to upload any images to Cloudinary");

    const updatedHotel = await hotelModel.findByIdAndUpdate(hotelId, { $push: { hotelImages: { $each: uploadedUrls } } }, { new: true, runValidators: true });
    if (!updatedHotel) return apiError(res, 500, "Failed to update hotel gallery");

    await Promise.all([
      hoteldataCache.del(`hotel_${hotelId}`),
      registerHotel.del(`hotel_${hotelId}`),
      hoteldataCache.del(`hotel_user_${updatedHotel.userID}`),
      hoteldataCache.del("all_hotels"),
      hoteldataCache.del("featured_hotels"),
      hoteldataCache.del("high_reviewed_hotels"),
      hoteldataCache.del("all_resort_hotels"),
    ]);

    return apiResponse(res, 200, true, "Hotel gallery updated successfully", { hotelId, uploadedCount: uploadedUrls.length, hotelImages: updatedHotel.hotelImages });
  } catch (error: any) {
    console.error("Error updating hotel gallery:", error);
    return apiError(res, 500, "Internal server error: Unable to update hotel gallery");
  }
});

const deleteHotelGalleryImage = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const { imageUrl } = req.body;

  if (!hotelId) return apiError(res, 400, "Hotel ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(hotelId)) return apiError(res, 400, "Invalid hotel ID format");
  if (!imageUrl) return apiError(res, 400, "Image URL is required in request body");

  try {
    const updatedHotel = await hotelModel.findByIdAndUpdate(hotelId, { $pull: { hotelImages: imageUrl } }, { new: true, runValidators: true });
    if (!updatedHotel) return apiError(res, 404, "Hotel not found", { hotelId });

    await Promise.all([
      hoteldataCache.del(`hotel_${hotelId}`),
      registerHotel.del(`hotel_${hotelId}`),
      hoteldataCache.del(`hotel_user_${updatedHotel.userID}`),
      hoteldataCache.del("all_hotels"),
      hoteldataCache.del("featured_hotels"),
      hoteldataCache.del("high_reviewed_hotels"),
      hoteldataCache.del("all_resort_hotels"),
    ]);

    return apiResponse(res, 200, true, "Image deleted successfully", { hotelId, deletedImageUrl: imageUrl, hotelImages: updatedHotel.hotelImages });
  } catch (error: any) {
    console.error("Error deleting hotel gallery image:", error);
    return apiError(res, 500, "Internal server error: Unable to delete hotel gallery image");
  }
});

const deleteRoom = asyncHandler(async (req: any, res: any) => {
  const { roomId } = req.params;

  if (!roomId) return apiError(res, 400, "Room ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(roomId)) return apiError(res, 400, "Invalid room ID format");

  try {
    const deletedRoom = await roomModel.findByIdAndDelete(roomId);
    if (!deletedRoom) return apiError(res, 404, "Room not found", { roomId });

    await hoteldataCache.del(`rooms_${deletedRoom.hotelId}`);
    return apiResponse(res, 200, true, "Room deleted successfully", { roomId, hotelId: deletedRoom.hotelId });
  } catch (error: any) {
    console.error("Error deleting room:", error);
    return apiError(res, 500, "Internal server error: Unable to delete room");
  }
});

const updateRoomInfo = asyncHandler(async (req: any, res: any) => {
  const { roomId } = req.params;

  if (!roomId) return apiError(res, 400, "Room ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(roomId)) return apiError(res, 400, "Invalid room ID format");

  try {
    const updatedData = { ...req.body };
    delete updatedData._id; delete updatedData.hotelId; delete updatedData.roomImages; delete updatedData.createdAt; delete updatedData.updatedAt;

    const updatedRoom = await roomModel.findByIdAndUpdate(roomId, { $set: updatedData }, { new: true, runValidators: true });
    if (!updatedRoom) return apiError(res, 404, "Room not found", { roomId });

    await hoteldataCache.del(`rooms_${updatedRoom.hotelId}`);
    return apiResponse(res, 200, true, "Room updated successfully", { roomId, hotelId: updatedRoom.hotelId, roomData: updatedRoom });
  } catch (error: any) {
    console.error("Error updating room:", error);
    if (error.name === "ValidationError") return apiError(res, 400, "Room validation failed", Object.entries(error.errors).map(([field, err]: any) => ({ field, message: err.message })));
    if (error.code === 11000) return apiError(res, 409, `Room ${Object.keys(error.keyPattern)[0]} already exists.`);
    if (error instanceof mongoose.Error.CastError) return apiError(res, 400, "Invalid data format");
    return apiError(res, 500, "Internal server error: Unable to update room");
  }
});

const updateRoomImages = asyncHandler(async (req: any, res: any) => {
  const { roomId } = req.params;
  const files = req.files || [];

  if (!roomId) return apiError(res, 400, "Room ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(roomId)) return apiError(res, 400, "Invalid room ID format");
  if (files.length === 0) return apiError(res, 400, "At least one image file is required");

  try {
    const room = await roomModel.findById(roomId);
    if (!room) return apiError(res, 404, "Room not found", { roomId });

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const filePath = file.path || file.tempFilePath;
      if (!filePath) { console.error("File path not found", file); continue; }
      const uploadResult = await uploadToCloudinary(filePath, "room_images");
      if (uploadResult) uploadedUrls.push(uploadResult);
    }

    const updatedRoom = await roomModel.findByIdAndUpdate(roomId, { $set: { roomImages: [...(room.roomImages || []), ...uploadedUrls] } }, { new: true, runValidators: true });
    if (!updatedRoom) return apiError(res, 404, "Room not found", { roomId });

    await hoteldataCache.del(`rooms_${updatedRoom.hotelId}`);
    return apiResponse(res, 200, true, "Room images updated successfully", { roomId, hotelId: updatedRoom.hotelId, roomData: updatedRoom });
  } catch (error: any) {
    console.error("Error uploading room images:", error);
    return apiError(res, 500, "Failed to upload room images", { error: error.message });
  }
});

const deleteRoomImages = asyncHandler(async (req: any, res: any) => {
  const { roomId } = req.params;
  const { imageUrl } = req.body;

  if (!roomId) return apiError(res, 400, "Room ID is required in URL parameters");
  if (!mongoose.Types.ObjectId.isValid(roomId)) return apiError(res, 400, "Invalid room ID format");
  if (!imageUrl) return apiError(res, 400, "Image URL is required in request body");

  try {
    const updatedRoom = await roomModel.findByIdAndUpdate(roomId, { $pull: { roomImages: imageUrl } }, { new: true, runValidators: true });
    if (!updatedRoom) return apiError(res, 404, "Room not found", { roomId });

    await hoteldataCache.del(`rooms_${updatedRoom.hotelId}`);
    return apiResponse(res, 200, true, "Image deleted successfully", { roomId, deletedImageUrl: imageUrl, roomImages: updatedRoom.roomImages });
  } catch (error: any) {
    return apiError(res, 500, "Failed to delete room image", { error: error.message });
  }
});

export {
  registerHotelRequest, deleteRoomImages, createroom, deleteRoom, updateRoomImages,
  updateRoomInfo, featuredHotels, HotelData, syncBookingHistory, getBookingHistoryByHotelId,
  RoomData, searchHotels, searchRooms, getHotelInfo, highReviewedHotels, getAllHotels,
  getAllResortHotels, displayRooms, getHotelByLocation, getPaymentCredentials, getAllRatings,
  updateHotelInfo, updateHotelGallery, approveRegistration, declineRegistration, deleteHotelGalleryImage,
};