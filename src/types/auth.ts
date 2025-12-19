import { Types } from "mongoose";

export interface SignUpParams {
  userId: string;
  nickname: string;
  password: string;
}

export type LoginParams = Omit<SignUpParams, "nickname">;

export interface User {
  _id: Types.ObjectId;
  nickname: string;
  userId: string;
  password: string;
  description: string;
  profile: {
    url?: string;
    public_id?: string;
  };
  postCount: number;
  followerCount: number;
  followingCount: number;
}
