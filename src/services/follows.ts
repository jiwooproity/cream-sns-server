import Follows from "@/models/follows";
import User from "@/models/user";

import * as Types from "@/types/follows";

export async function addFollows({ userId, targetId }: Types.FollowsServiceParams) {
  await Follows.create({ from: userId, to: targetId });

  await Promise.all([
    User.updateOne({ _id: userId }, { $inc: { followingCount: 1 } }),
    User.updateOne({ _id: targetId }, { $inc: { followerCount: 1 } }),
  ]);
}

export async function unFollows({ userId, targetId }: Types.FollowsServiceParams) {
  const deleted = await Follows.findOneAndDelete({ from: userId, to: targetId });

  if (deleted) {
    await Promise.all([
      User.updateOne({ _id: userId }, { $inc: { followingCount: -1 } }),
      User.updateOne({ _id: targetId }, { $inc: { followerCount: -1 } }),
    ]);
  }
}
