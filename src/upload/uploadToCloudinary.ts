import streamifier from "streamifier";

// Image Storage
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
  UploadResponseCallback,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export function uploadToCloudinary(
  file: Express.Multer.File,
  options: {
    folder: string;
  }
): Promise<{ url: string; public_id: string } | undefined> {
  return new Promise((resolve, reject) => {
    const upload_option: UploadApiOptions = {
      folder: options.folder,
      resource_type: "image",
      overwrite: true,
    };

    const callback: UploadResponseCallback = (error, result) => {
      if (error || !result) {
        resolve(undefined);
      } else {
        const { secure_url, public_id } = result;
        resolve({ url: secure_url, public_id });
      }
    };

    const stream = cloudinary.uploader.upload_stream(upload_option, callback);
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

export function deleteInCloudinary(public_id: string): Promise<UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    const callback: UploadResponseCallback = (error, result) => {
      if (error || !result) {
        resolve(undefined);
      } else {
        resolve(result);
      }
    };

    cloudinary.uploader.destroy(public_id, {}, callback);
  });
}
