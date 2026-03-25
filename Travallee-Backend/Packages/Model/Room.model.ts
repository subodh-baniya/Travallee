import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotelModel",
      required: true,
    },

    // Basic Info
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },

    roomType: {
      type: String,
      required: true,
    },

    suitetype: {
      type: String,
      required: true,
    },

    roomDescription: {
      type: String,
      required: true,
    },

    // Capacity & Physical Details
    maxOccupancy: {
      type: Number,
      required: true,
      min: 1,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    roomSize: {
      type: Number,
      required: false,
    },

    bedType: {
      type: String,
      required: true,
    },

    floorNumber: {
      type: Number,
      required: false,
      default: 0,
    },

    viewType: {
      type: String,
      enum: ["city", "garden", "beach", "mountain", "street", "pool", "none"],
      default: "none",
    },

    // Pricing
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    weekendPrice: {
      type: Number,
      required: false,
    },

    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Policies
    minStayNights: {
      type: Number,
      default: 1,
      min: 1,
    },

    cancellationPolicy: {
      type: String,
      required: true,
    },

    // Amenities & Features
    amenities: {
      type: [String],
      required: true,
    },

    specialFeatures: {
      type: [String],
      default: [],
    },

    roomImages: {
      type: [String],
      required: true,
    },

    // Room Facilities
    isAccessible: {
      type: Boolean,
      default: false,
    },

    hasBathtub: {
      type: Boolean,
      default: false,
    },

    hasShower: {
      type: Boolean,
      default: false,
    },

    hasBalcony: {
      type: Boolean,
      default: false,
    },

    hasAC: {
      type: Boolean,
      default: true,
    },

    hasHeating: {
      type: Boolean,
      default: false,
    },

    hasWifi: {
      type: Boolean,
      default: true,
    },

    // Status & Ratings
    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numberOfReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export const roomModel = mongoose.model("rooms", roomSchema);