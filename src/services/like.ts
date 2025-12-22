import Likes from "@/models/likes";
import Post from "@/models/post";

import * as Types from "@/types/like";

export async function getLikes({ userId }: Omit<Types.LikeServiceParams, "postId">) {
  const likedIds = await Likes.find({ userId }).distinct("postId");
  return await Post.aggregate([{ $match: { _id: { $in: likedIds } } }]);
}

export async function addLike({ userId, postId }: Types.LikeServiceParams) {
  await Likes.create({ userId, postId });
  await Post.updateOne({ _id: postId }, { $inc: { likeCount: 1 } });
}

export async function removeLike({ userId, postId }: Types.LikeServiceParams) {
  await Likes.deleteOne({ userId, postId });
  await Post.updateOne({ _id: postId }, { $inc: { likeCount: -1 } });
}
