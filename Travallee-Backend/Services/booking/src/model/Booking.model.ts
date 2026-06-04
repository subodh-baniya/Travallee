import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    },
    Name:{
        type:String,
        required:false
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hotelModel"
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roomModel"
    },

    guests: {
        type: Number,
        required: true
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["CANCELLED", "PENDING","CONFIRMED"],
        default: "PENDING"

    },
    bookingPayment:{
        type:String,
        enum:["PAID","NOTPAID"],
        default:"NOTPAID"
    },
    totalPrice:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["KHALTI","ESEWA","COD"],
        required:true
    },
    paymentReferenceId:{
        type:String
    },
    khalti_pidx:{
        type:String,
        default:null
    },
    hotelName:{
        type:String,
        required:true
    },
    roomNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    totalNights:{
        type:Number,
        required:false
    },

}, { timestamps: true })

export const bookingModel = mongoose.model("bookings", bookingSchema)