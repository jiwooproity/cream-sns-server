import express from "express";
import bcrypt from "bcrypt";

// Models
import User from "@/models/user";

const router = express.Router();

router.get("/me", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: "로그인 상태가 아닙니다." });
  }
});

router.post("/signup", async (req, res) => {
  const { userId, nickname, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  try {
    const user = new User({ userId, nickname, password: hashed });
    await user.save();
    res.status(200).json({ message: "회원가입 완료" });
  } catch (err) {
    res.status(400).json({ message: "이미 존재하는 사용자입니다." });
  }
});

router.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  try {
    // 가입된 사용자 검색
    const user = await User.findOne({ userId });
    if (!user) return res.status(400).json({ message: "존재하지 않는 사용자입니다." });

    // 비밀번호 매칭 확인
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

    req.session.user = {
      id: user._id,
    };

    res.status(200).json(req.session.user);
  } catch (e) {
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/logout", async (req, res) => {
  const clear = () => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "로그아웃 완료" });
  };

  req.session.destroy(clear);
});

export default router;
