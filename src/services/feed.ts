import * as Types from "@/types/feed";

import Follows from "@/models/follows";
import Post from "@/models/post";
import mongoose from "mongoose";

export async function getFeeds({ userId }: Types.GetFeedsParams): Promise<Types.Feed[]> {
  const followingIds = await Follows.find({ from: userId }).distinct("to");

  return await Post.aggregate([
    { $match: { author: { $in: followingIds } } },
    { $sort: { createdAt: -1 } },
    { $limit: 20 },
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
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
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
