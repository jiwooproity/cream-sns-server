import express from "express";

// Models
import User from "@/models/user";

const router = express.Router();

router.patch("/edit", async (req, res) => {
  const { nickname, description } = req.body;
  const { userId } = req.session.user!;

  try {
    const user = await User.findOne({ userId });

    if (user) {
      user.nickname = nickname;
      user.description = description;
      await user.save();

      req.session.user = {
        ...req.session.user,
        nickname: nickname,
        description: description,
      };

      res.status(200).json(req.session.user);
    } else {
      res.status(400).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (e) {
    res.status(500).json({ message: "프로필 업데이트에 실패하였습니다." });
  }
});

export default router;
