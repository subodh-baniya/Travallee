
import {asyncHandler} from "../config/asynchandler.js"
import { apiError, apiResponse } from "../config/response/api.response.js";
import { hotelModel } from "../model/Hotel.model.js"
import { roomModel } from "../model/Room.model.js"
import {uploadToCloudinary} from "../config/Func/cloudinary.js"
import type { HotelInput, RoomInput } from "../validator/hotel.validator.js";
import {
  createHotelSchema,
  createRoomSchema,
} from "../validator/hotel.validator.js";
import mongoose, { mongo } from "mongoose";
import redis from "ioredis"
import { Queue } from "bullmq"; 

const connection ={
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
}
//@ts-ignore
const registerHotel = new redis(connection);

const registerHotelQueue = new Queue("HotelRegistration", {
  connection
});



// register and edit controller always at top please

const registerHotelRequest = asyncHandler(async (req: any, res: any) => {
  const userID = req.user.id || req.user._id;
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
    const parsedData = createHotelSchema.safeParse(req.body);
    if (!parsedData.success) {
      return apiError(res, 400, "Validation failed", parsedData.error.issues);
    }
    const hotelData: HotelInput = parsedData.data;
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

    const response = await roomModel.create(roomData as any);

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
  console.log("User from req.user:", req.user);
  console.log("Fetching hotel information for user ID:", userId);
  console.log("User ID type:", typeof userId);

  if (!userId) {
    return apiError(res, 401, "User not authenticated");
  }

  const hotelData = await hotelModel.findOne({
    userID: new mongo.ObjectId(userId),
  });

  console.log("Query result:", hotelData);

  if (!hotelData) {
    // Try alternative query for debugging
    const allHotels = await hotelModel.find({});
    console.log("All hotels in DB:", allHotels);
    return apiError(res, 404, "Hotel not found for this user");
  }

  apiResponse(
    res,
    200,
    true,
    "Hotel information retrieved successfully",
    hotelData,
  );
});

const highReviewedHotels = asyncHandler(async (req: any, res: any) => {

  const hotels = await hotelModel
    .find({ rating: { $gte: 4.0 } })
    .select(
      "hotelName hotelLocation hotelImages propertyType rating numberOfReviews isFeatured",
    )
    .sort({ rating: -1, numberOfReviews: -1 });

  if (hotels.length === 0) {
    return apiError(res, 404, "No highly reviewed hotels found");
  }

  return apiResponse(
    res,
    200,
    true,
    "Highly reviewed hotels retrieved successfully",
    hotels,
  );

});

const getAllHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const hotels = await hotelModel.find({}).limit(10);
    if (hotels.length === 0) {
      console.log("No active hotels found in database");
      return apiResponse(res, 200, true, "No hotels available", []);
    }
    console.log(`Retrieved ${hotels.length} hotels`);
    return apiResponse(res, 200, true, "Hotels retrieved successfully", hotels);
  } catch (error: any) {
    console.error("Error fetching hotels:", error.message);
    return apiError(res, 500, "Failed to fetch hotels: " + error.message);
  }
});

const getAllResortHotels = asyncHandler(async (req: any, res: any) => {
  try {
    const hotels = await hotelModel.find({ propertyType: "Resort", isactive: true }).limit(10);
    if (hotels.length === 0) {
      console.log("No active resorts found in database");
      return apiResponse(res, 200, true, "No resorts available", []);
    }
    console.log(`Retrieved ${hotels.length} resorts`);
    return apiResponse(res, 200, true, "Resort hotels retrieved successfully", hotels);
  } catch (error: any) {
    console.error("Error fetching resorts:", error.message);
    return apiError(res, 500, "Failed to fetch resorts: " + error.message);
  }
});

// const getHotelDashboard = asyncHandler(async (req: any, res: any) => {
//   try {
//     const userId = req.user?.id || req.user?._id;

//     if (!userId) {
//       return apiError(res, 401, "Unauthorized");
//     }

//     const hotel = await hotelModel.findOne({ userID: userId });

//     if (!hotel) {
//       return apiError(res, 404, "Hotel not found");
//     }

//     const hotelId = hotel._id;

//     const rooms = await roomModel.find({ hotelId });

//     const totalRooms = rooms.length;

//     const occupiedRooms = rooms.filter((r: any) => r.status === "OCCUPIED").length;

//     const availableRooms = rooms.filter((r: any) => r.status === "AVAILABLE").length;

//     const bookings = axios.get(`${process.env.BOOKING_SERVICE_URL}/bookings/hotel/${hotelId}`).then(response => response.data).catch(() => null);

//     const totalRevenue = bookings.reduce(
//       (sum: number, b: any) => sum + (b.totalPrice || 0),
//       0
//     );

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const todayCheckins = bookings.filter((b: any) =>
//       new Date(b.checkIn) >= today
//     );

//     const roomData = rooms.map((r: any) => ({
//       roomNumber: r.roomNumber,
//       floorNumber: r.floorNumber || 0,
//       roomType: r.roomType,
//       status: r.status,
//       pricePerNight: r.pricePerNight,
//     }));

//     const checkins = todayCheckins.map((b: any) => ({
//       guestName: b.userName || "Guest",
//       roomNumber: b.roomNumber || "—",
//       checkInTime: new Date(b.checkIn).toISOString(),
//     }));

//     return apiResponse(res, 200, true, "Dashboard data", {
//       stats: {
//         totalRevenue,
//         totalRooms,
//         occupiedRooms,
//         availableRooms,
//         todayCheckins: todayCheckins.length,
//       },
//       rooms: roomData,
//       checkins,
//       hotel: {
//         _id: hotel._id,
//         hotelName: hotel.hotelName,
//         hotelLocation: hotel.hotelLocation,
//       },
//     });
//   } catch (error: any) {
//     return apiError(res, 500, "Dashboard error", error.message);
//   }
// });

const displayRooms = asyncHandler(async (req: any, res: any) => {
  const { hotelId } = req.params;
  try {
    const rooms = await roomModel.find({ hotelId });
    if (rooms.length === 0) {
      return apiError(res, 404, "No rooms found for this hotel");
    } return apiResponse(res, 200, true, "Rooms retrieved successfully", rooms);
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


  export {
    registerHotelRequest,
    createroom,
    // deleteRoom,
    featuredHotels,
    HotelData,
    RoomData,
    searchHotels,
    searchRooms,
    getHotelInfo,
    highReviewedHotels,
    getAllHotels,
    getAllResortHotels,
    displayRooms,
    getHotelByLocation,
  };

