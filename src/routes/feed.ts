import express from "express";

import Follows from "@/models/follows";
import Post from "@/models/post";

const router = express();

router.get("/detail/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const feed = await Post.findById(id).populate({
      path: "author",
      select: "id nickname profile",
    });

    if (feed) {
      res.status(200).json(feed);
    } else {
      res.status(400).json({ message: "존재하지 않거나 삭제된 게시글입니다." });
    }
  } catch (e) {
    res.status(500).json({ message: "게시글 조회를 실패하였습니다." });
  }
});

router.get("/list", async (req, res) => {
  const id = req.session.user?.id;

  try {
    const followingIds = await Follows.find({ from: id }).distinct("to");

    const feeds = await Post.aggregate([
      { $match: { author: { $in: followingIds } } },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
      { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } },
      { $unwind: "$author" },
      {
        $project: {
          id: "$_id",
          content: 1,
          image: 1,
          createdAt: 1,
          author: {
            id: "$author._id",
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
