import {
  asyncHandler,
  apiError,
  apiResponse,
  hotelModel,
  roomModel,
  uploadToCloudinary,
  passwordCheck,
} // @ts-ignore
 from "@packages";
import type { HotelInput, RoomInput } from "../validator/hotel.validator.js";
import {
  createHotelSchema,
  createRoomSchema,
} from "../validator/hotel.validator.js";
import mongoose, { mongo } from "mongoose";

const registerHotel = asyncHandler(async (req: any, res: any) => {
  const userID = req.user.id;
  const files = req.files || [];

  if (!userID) {
    return apiError(res, 401, "Unauthorized: User ID not found in request");
  }
  req.body.userID = userID;

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
        if (file.fieldname === "VerificationDocuments" || file.fieldname === "verificationDocuments") {
          const uploadResult = await uploadToCloudinary(filePath, "verification_documents");
          if (uploadResult) verificationDocUrls.push(uploadResult);
        } else {
         
          const uploadResult = await uploadToCloudinary(filePath, "hotel_images");
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
      return apiError(res, 500, "Failed to upload files", { error: error.message });
    }
  } else {
    // Empty arrays if no files
    req.body.hotelImages = [];
    req.body.VerificationDocuments = [];
  }

  try {
    const parsedData = createHotelSchema.safeParse(req.body);
    if (!parsedData.success) {
      return apiError(res, 400, "Validation failed", parsedData.error.issues);
    }
    const hotelData: HotelInput = parsedData.data;
    const newHotel = new hotelModel(hotelData);
    await newHotel.save();
    return apiResponse(
      res,
      201,
      true,
      "Hotel registered successfully",
      newHotel,
    );
  } catch (error: any) {
    console.error("Error registering hotel:", error);
    if (error.name === "ValidationError") {
      return apiError(res, 400, "Hotel validation failed", error.errors);
    }
    return apiError(res, 500, "Internal server error: Unable to register hotel");
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
      return apiError(res, 500, "Failed to upload room images", { error: error.message });
    }
  }

  try {
    // Verify hotel exists
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }

    // Validate room data
    const parsedData = createRoomSchema.safeParse(req.body);
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

    if (existingRoom) {
      return apiError(
        res,
        409,
        "Room with this number already exists in this hotel",
      );
    }

    const response = await roomModel.create(roomData);

    if (!response) {
      return apiError(res, 500, "Failed to save room to database");
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

const deleteRoom = asyncHandler(async (req: any, res: any) => {
  const userID = req.user?._id || req.user?.id;
   if (!userID) {
    return apiError(res, 401, "Unauthorized: User ID not found in request");
  }
  const { hotelId, roomId } = req.params;
  const { password } = req.body;

   if (!userID || !password) {
    return apiError(res, 400, "User ID and password are required in request body");
  }

  const passwordCheckResult = await passwordCheck(password, userID);
  if (!passwordCheckResult.success) {
    return apiError(res, 401, "Unauthorized: " + passwordCheckResult.message);
  }

  if (
    !mongoose.Types.ObjectId.isValid(hotelId) ||
    !mongoose.Types.ObjectId.isValid(roomId)
  ) {
    return apiError(res, 400, "Invalid hotel ID or room ID format");
  }

  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return apiError(res, 404, "Hotel not found", { hotelId });
    }

    const room = await roomModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(roomId),
      hotelId: new mongoose.Types.ObjectId(hotelId),
    });

    if (!room) {
      return apiError(res, 404, "Room not found in this hotel", { roomId });
    }

    return apiResponse(res, 200, true, "Room deleted successfully");
  } catch (error: any) {
    return apiError(
      res,
      500,
      "Internal server error: Unable to delete room. Please try again later.",
    );
  }
});

const featuredHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const hotels = await hotelModel.find({ isFeatured: true });
    if (hotels.length === 0) {
      return apiError(res, 404, "No featured hotels found");
    }
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

const HotelData = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return apiError(res, 404, "Hotel not found");
    }
    return apiResponse(
      res,
      200,
      true,
      "Hotel data retrieved successfully",
      hotel,
    );
  } catch (error) {
    return apiError(res, 500, "Internal server error");
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
        "hotelName hotelLocation hotelImages propertyType rating numberOfReviews isFeatured"
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


// not completed
const Filter = asyncHandler(async (req: any, res: any) => {
    
});


const searchRooms = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  const { query, roomType, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

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
        "roomNumber roomType pricePerNight capacity amenities roomImages rating"
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
const getHotelInfo = asyncHandler(async (req:any, res:any) => {
    const userId = req.user?.id || req.user?._id;
    console.log("User from req.user:", req.user);
    console.log("Fetching hotel information for user ID:", userId);
    console.log("User ID type:", typeof userId);

    if (!userId) {
        return apiError(res, 401, "User not authenticated");
    }

    const hotelData = await hotelModel.findOne({ userID: new mongo.ObjectId(userId) });
    
    console.log("Query result:", hotelData);
    
    if (!hotelData) {
        // Try alternative query for debugging
        const allHotels = await hotelModel.find({});
        console.log("All hotels in DB:", allHotels);
        return apiError(res, 404, "Hotel not found for this user");
    }
    
    apiResponse(res, 200, true, "Hotel information retrieved successfully", hotelData);
})



export {
  registerHotel,
  createroom,
  deleteRoom,
  featuredHotels,
  HotelData,
  RoomData,
  searchHotels,
  searchRooms,
  getHotelInfo,
};
