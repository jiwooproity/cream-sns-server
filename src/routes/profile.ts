import express from "express";

// Parser
import upload from "@/upload/config";

// Models
import User from "@/models/user";

// Image upload
import { uploadToCloudinary, deleteInCloudinary } from "@/upload/uploadToCloudinary";

const router = express.Router();

router.get("/info/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id, "-password");
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "프로필 조회에 실패하였습니다." });
  }
});

router.patch("/edit", upload.single("image"), async (req, res) => {
  const { file } = req;
  const { nickname, description } = req.body;
  const { id } = req.session.user!;

  // 이미지 URL
  let image;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "사용자를 찾을 수 없습니다." });

    // 이미지 파일 업로드
    if (file) {
      image = await uploadToCloudinary(file, { folder: "cream/profile" });
    }

    // 프로필 이미지 변경이 시도된 경우, 이전 프로필 제거
    if (image && user.profile.public_id) {
      deleteInCloudinary(user.profile.public_id);
    }

    user.nickname = nickname;
    user.description = description;
    user.profile = image ?? user.profile;
    await user.save();

    req.session.user = {
      id: user._id,
    };

    res.status(200).json(req.session.user);
  } catch (e) {
    res.status(500).json({ message: "프로필 업데이트에 실패하였습니다." });
  }
});

export default router;
