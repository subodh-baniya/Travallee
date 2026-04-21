import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    type: { type: String, required: true, unique: true }, 
    imageUrl: { type: String, required: true },
    alt: { type: String, required: true, maxlength: 100 },
}, { timestamps: true });

const BannerModel = mongoose.model("Banner", bannerSchema);

export { BannerModel }; 