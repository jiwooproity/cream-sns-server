import { Types } from "mongoose";
import { CloudinaryImage } from "./cloudinary";

export interface Post {
  author: Types.ObjectId;
  content: string;
  createdAt: number;
  image?: CloudinaryImage | undefined;
}

export interface GetPostsParams {
  author: string;
}

export interface GetPostParams {
  postId: string;
}

export interface CreateParams {
  content: string;
  createdAt: number;
}

export interface CreateServiceParam extends CreateParams {
  author: string;
  image: CloudinaryImage | undefined;
}

export interface DeleteParams {
  postId: string;
  author: string;
}

export interface EditPostParams {
  postId: string;
  content: string;
}
