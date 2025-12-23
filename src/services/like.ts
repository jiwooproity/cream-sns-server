import mongoose from "mongoose";

// Models
import Likes from "@/models/likes";
import Post from "@/models/post";

export async function getLikes({ userId, myId }: { userId: string; myId: string }) {
  const likedIds = await Likes.find({ userId }).distinct("postId");
  return await Post.aggregate([
    { $match: { _id: { $in: likedIds } } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "likes",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$postId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(myId)] },
                ],
              },
            },
          },
        ],
        as: "liked",
      },
    },
    { $addFields: { isLiked: { $gt: [{ $size: "$liked" }, 0] } } },
    { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } },
    { $unwind: "$author" },
    {
      $project: {
        id: "$_id",
        content: 1,
        image: 1,
        createdAt: 1,
        author: { id: "$author._id", nickname: 1, profile: 1 },
        likeCount: 1,
        commentCount: 1,
        isLiked: 1,
      },
    },
  ]);
}

export async function addLike({ userId, postId }: { userId: string; postId: string }) {
  await Likes.create({ userId, postId });
  await Post.updateOne({ _id: postId }, { $inc: { likeCount: 1 } });
}

export async function removeLike({ userId, postId }: { userId: string; postId: string }) {
  const deleted = await Likes.deleteOne({ userId, postId }, { new: true });

  if (deleted) {
    await Post.updateOne({ _id: postId }, { $inc: { likeCount: -1 } });
  }
}
