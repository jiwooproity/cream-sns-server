import Follows from "@/models/follows";
import User from "@/models/user";

import * as Types from "@/types/profile";

export async function getProfile({
  myId,
  userId,
}: Types.GetProfileParams): Promise<Types.UserWithStatus> {
  const user = await User.findById(userId, "-password").lean();
  const follow = await Follows.findOne({ from: myId, to: userId });

  if (!user) {
    throw new Error("프로필 조회를 실패하였습니다.");
  }

  return { ...user, id: user._id, isFollowed: !!follow };
}

export async function editProfile({
  userId,
  nickname,
  description,
  image,
}: Types.EditProfileServiceParams): Promise<Types.User> {
  const pipeline = { $set: { nickname, description, profile: image } };
  const user = await User.findByIdAndUpdate(userId, pipeline, { new: true });

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return user;
}
