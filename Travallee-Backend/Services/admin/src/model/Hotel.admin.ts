import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    bookingdata: {
        type: [Object],
        required: true
    }
    
}, { timestamps: true });


export const adminModel = mongoose.model("Admin", adminSchema);