import User from "@/models/user";
import * as Types from "@/types/search";
import mongoose from "mongoose";

export async function searching({ q, userId }: Types.SearchServiceParams) {
  const filter = {
    _id: { $ne: new mongoose.Types.ObjectId(userId) },
    $or: [{ userId: { $regex: q, $options: "i" } }, { nickname: { $regex: q, $options: "i" } }],
  };

  const users = await User.find(filter)
    .sort({ _id: 1 })
    .select("_id userId nickname description profile");

  return users;
}
