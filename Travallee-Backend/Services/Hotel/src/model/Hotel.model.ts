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
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        review: { type: String },
      },
    ],
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
        bookingId: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "rooms" },
        guestName: { type: String },
        roomNumber: { type: String },
        checkinDate: { type: Date, required: true },
        checkoutDate: { type: Date, required: true },
        totalPrice:{ type: Number, required: true },
        stayDurationNights: { type: Number },
        paymentMethod: { type: String, required: true },
        bookingPayment: { type: String, required: true },
        status: { type: String, required: true },
        guests: { type: Number, required: true },
        email: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    roomIDs:[]  },
  { timestamps: true },
);

export const hotelModel = mongoose.model("hotels", HotelSchema);
