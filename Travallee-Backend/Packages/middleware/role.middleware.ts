import jwt from "jsonwebtoken";
import { apiError } from "../Utils/response/api.error.js";
import { hotelModel } from "../Model/Hotel.model.js";
import { UserModel } from "../Model/User.model.js";


const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return apiError(res, 401, "Unauthorized: No token provided");
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("Token verification error:", error.message);
    return apiError(res, 401, "Invalid or expired token");
  }
};


const checkRole = (role: string) => {
  return async (req: any, res: any, next: any) => {
    if (!req.user) {
      return apiError(res, 401, "Unauthorized: User not authenticated");
    }

    if (req.user.role !== role) {
      return apiError(
        res,
        403,
        `Forbidden: ${role.charAt(0).toUpperCase() + role.slice(1)} access required`
      );
    }

    next();
  };
};

// Check multiple roles (OR condition)
const checkRoles = (roles: string[]) => {
  return async (req: any, res: any, next: any) => {
    if (!req.user) {
      return apiError(res, 401, "Unauthorized: User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      return apiError(
        res,
        403,
        `Forbidden: Access requires one of these roles: ${roles.join(", ")}`
      );
    }

    next();
  };
};

// Specific role middlewares
const adminMiddleware = checkRole("admin");
const hotelOwnerMiddleware = checkRole("hotelOwner");
const userMiddleware = checkRole("user");
const superAdminMiddleware = checkRole("superadmin");
const hotelAdminMiddleware = checkRole("hotelAdmin");

// Multiple roles middleware
const adminOrOwnerMiddleware = checkRoles(["admin", "hotelOwner"]);
const anyAuthenticatedMiddleware = checkRoles(["admin", "hotelOwner", "user"]);
const superAdminOrHotelAdminMiddleware = checkRoles(["superadmin", "hotelAdmin"]);

// Check ownership (for hotels/rooms)
const checkOwnership = async (req: any, res: any, next: any) => {
  if (!req.user) {
    return apiError(res, 401, "Unauthorized: User not authenticated");
  }

  const userID = req.user._id || req.user.id;
  const { hotelId } = req.params;

  if (!hotelId) {
    return apiError(res, 400, "Hotel ID is required");
  }

  try {
    const hotel = await hotelModel.findOne({
      _id: hotelId,
      userID: userID,
    });

    if (!hotel) {
      return apiError(
        res,
        403,
        "Forbidden: You do not have permission to access this hotel"
      );
    }
    req.ownerID = userID;
    req.targetHotelID = hotelId;
    req.hotel = hotel;
    next();
  } catch (error: any) {
    console.error("Error checking ownership:", error);
    return apiError(res, 500, "Error checking ownership");
  }
};

export {
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
};
