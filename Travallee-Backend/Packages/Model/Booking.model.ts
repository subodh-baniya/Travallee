import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
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
        enum:["KHALTI","ESEWA"],
        required:true
    },

    paymentReferenceId:{
        type:String
    },
    khalti_pidx:{
        type:String,
        default:null
    }

}, { timestamps: true })

export const bookingModel = mongoose.model("bookings", bookingSchema)