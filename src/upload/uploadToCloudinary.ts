import streamifier from "streamifier";

// Image Storage
import { v2 as cloudinary, UploadApiOptions, UploadResponseCallback } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function uploadToCloudinary(
  file: Express.Multer.File,
  options: {
    folder: string;
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const upload_option: UploadApiOptions = {
      folder: options.folder,
      resource_type: "image",
      overwrite: true,
    };

    const callback: UploadResponseCallback = (error, result) => {
      if (error || !result) return resolve("");
      resolve(result.secure_url);
    };

    const stream = cloudinary.uploader.upload_stream(upload_option, callback);
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

export default uploadToCloudinary;
