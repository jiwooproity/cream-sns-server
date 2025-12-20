import { Types } from "mongoose";
import { CloudinaryImage } from "./cloudinary";

export interface GetProfileParams {
  myId: string;
  userId: string;
}

export interface EditProfileParams {
  nickname: string;
  description: string;
}

export interface EditProfileServiceParams {
  userId: string;
  nickname: string;
  description: string;
  image: CloudinaryImage | undefined;
}

export interface User {
  _id: Types.ObjectId;
  userId: string;
  nickname: string;
  description: string;
  profile: {
    url?: string;
    public_id?: string;
  };
  postCount: number;
  followerCount: number;
  followingCount: number;
}

export interface UserWithStatus extends User {
  id: Types.ObjectId;
  isFollowed: boolean;
}
