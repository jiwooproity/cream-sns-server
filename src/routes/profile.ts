import express from "express";

// Parser
import multer from "multer";

// Models
import User from "@/models/user";

// Image upload
import uploadToCloudinary from "@/upload/uploadToCloudinary";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("이미지 파일"));
    } else {
      cb(null, true);
    }
  },
});

const router = express.Router();

router.patch("/edit", upload.single("image"), async (req, res) => {
  const { file } = req;
  const { nickname, description } = req.body;
  const { profile, userId } = req.session.user!;

  // 이미지 URL
  let imageURL;

  try {
    const user = await User.findOne({ userId });

    // 이미지 파일 업로드
    if (file) {
      imageURL = await uploadToCloudinary(file, { folder: "cream/profile" });
    }

    if (user) {
      user.nickname = nickname;
      user.description = description;
      user.profile = imageURL ?? profile!;
      await user.save();

      req.session.user = {
        ...req.session.user,
        profile: imageURL ?? profile!,
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
