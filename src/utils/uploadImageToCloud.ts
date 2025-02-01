import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImageToCloudinary = async (path: string) => {
  try {
    const result = await cloudinary.uploader.upload(path);

    fs.unlinkSync(path);

    return result.secure_url;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default uploadImageToCloudinary;
