import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const uploadToCloudinary = async (image: any, name: string) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
      folder: name,
    });

    if (fs.existsSync(image)) {
      fs.unlinkSync(image);
      console.log(`Deleted local file: ${image}`);
    }

    return result.secure_url;
  } catch (error: any) {
    console.log("Error uploading file to Cloudinary:", error);
    if (fs.existsSync(image)) {
      fs.unlinkSync(image);
    }
  }
};

export { uploadToCloudinary };
