import mongoose, { SchemaType } from "mongoose";


const HotelSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerName: {
      type: String,
      required: true,
    },
    hotelDescription: {
      type: String,
      required: true,
    },
    hotelLocation: {
      type: String,
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    hotelImages: {
      type: [String],
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    VerificationDocuments: {
      type: [String],
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    isactive: {
      type: Boolean,
      default: false,
    },
    facilities: {
      type: [String],
      required: true,
    },
    checkinTime: {
      type: String,
      required: true,
    },
    checkoutTime: {
      type: String,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    esewa_Merchantid:{
            type:String,
           default:"EPAYTEST" //in production it will be provided by the hotel when they register as merchant 
    },
    khalti_SecretKey: {
       type: String } 
    ,
    rooms: [
      {
        roomNumber: { type: String, required: true },
        roomType: { type: String, required: true },
        pricePerNight: { type: Number, required: true },
        suitetype: { type: String, required: true },
      },
    ],
    bookingHistory: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        roomId: { type: mongoose.Schema.Types.ObjectId },
        checkinDate: { type: Date, required: true },
        checkoutDate: { type: Date, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    roomIDs:[]  },
  { timestamps: true },
);

export const hotelModel = mongoose.model("hotels", HotelSchema);
