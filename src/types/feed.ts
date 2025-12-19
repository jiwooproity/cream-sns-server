import { CloudinaryImage } from "./cloudinary";

export interface Feed {
  id: string;
  content: string;
  image: CloudinaryImage;
  createdAt: number;
  author: Author;
}

export interface Author {
  id: string;
  nickname: string;
  profile: CloudinaryImage;
}

export interface GetFeedsParams {
  userId: string;
}
