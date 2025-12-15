import express from "express";

// Parser
import upload from "@/upload/config";

// Models
import User from "@/models/user";

// Image upload
import { uploadToCloudinary, deleteInCloudinary } from "@/upload/uploadToCloudinary";

const router = express.Router();

router.patch("/edit", upload.single("image"), async (req, res) => {
  const { file } = req;
  const { nickname, description } = req.body;
  const { profile, userId } = req.session.user!;

  // 이미지 URL
  let image;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(400).json({ message: "사용자를 찾을 수 없습니다." });

    // 이미지 파일 업로드
    if (file) {
      image = await uploadToCloudinary(file, { folder: "cream/profile" });
    }

    // 프로필 이미지 변경이 시도된 경우, 이전 프로필 제거
    if (image && profile.public_id) {
      deleteInCloudinary(profile.public_id);
    }

    user.nickname = nickname;
    user.description = description;
    user.profile = image ?? profile;
    await user.save();

    req.session.user = {
      ...req.session.user,
      profile: image ?? profile,
      nickname: nickname,
      description: description,
    };

    res.status(200).json(req.session.user);
  } catch (e) {
    res.status(500).json({ message: "프로필 업데이트에 실패하였습니다." });
  }
});

export default router;
