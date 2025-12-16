import express from "express";

import Follows from "@/models/follows";

const router = express();

router.post("/add", async (req, res) => {
  const { targetId } = req.body;

  const userId = req.session.user?.id;

  try {
    const follows = new Follows({ from: userId, to: targetId });
    await follows.save();
    res.status(200).json({ message: "팔로우 완료" });
  } catch (e) {
    res.status(500).json({ message: "팔로우 요청을 실패하였습니다." });
  }
});

export default router;
