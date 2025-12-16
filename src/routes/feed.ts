import express from "express";

import { Types } from "mongoose";

import Follows from "@/models/follows";
import Post from "@/models/post";

const router = express();

router.get("/list", async (req, res) => {
  const userId = req.session.user?.id;

  try {
    const followingIds = await Follows.find({ from: userId }).distinct("to");

    const feeds = await Post.aggregate([
      { $match: { userId: { $in: followingIds } } },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
      { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      {
        $project: {
          postId: "$_id",
          content: 1,
          image: 1,
          createdAt: 1,
          user: {
            userId: "$user._id",
            nickname: 1,
            profile: 1,
          },
        },
      },
    ]);

    res.status(200).json(feeds);
  } catch (e) {
    res.status(500).json({ message: "피드 불러오기를 실패하였습니다." });
  }
});

export default router;
