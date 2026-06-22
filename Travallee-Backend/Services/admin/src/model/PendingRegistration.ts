import mongoose from "mongoose";

const PendingRegistrationSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ownerName: String,
        hotelName: String,
        hotelLocation: String,
        hotelDescription: String,
        contactNumber: String,
        email: String,
        propertyType: String,
        hotelImages: [String],
        VerificationDocuments: [String],
        facilities: [String],
        checkinTime: String,
        checkoutTime: String,
        pricePerNight: Number,
        starRating: { type: Number, default: 0 },
        roomCount: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["pending", "active", "declined"],
            default: "pending",
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        reviewedAt: Date,
        reviewedBy: mongoose.Schema.Types.ObjectId,
        notes: {
            type: String,
            default: "",
        },
        rawData: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
);

export const PendingRegistrationModel = mongoose.model(
    "PendingRegistration",
    PendingRegistrationSchema
);
