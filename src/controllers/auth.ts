import { Request, Response } from "express";

import bcrypt from "bcrypt";

import * as service from "@/services";

import * as Types from "@/types/auth";

export async function signUp(req: Request<{}, {}, Types.SignUpParams>, res: Response) {
  const { userId, nickname, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  try {
    await service.signUp({ userId, nickname, password: hashed });
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ message: "이미 존재하는 사용자입니다." });
  }
}

export async function login(req: Request<{}, {}, Types.LoginParams>, res: Response) {
  const { userId, password } = req.body;

  try {
    const user = await service.login({ userId, password });
    req.session.user = { id: user._id };
    res.status(200).json(req.session.user);
  } catch (e) {
    if (e instanceof Error) res.status(500).json({ message: e.message });
  }
}

export async function me(req: Request, res: Response) {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: "로그인 상태가 아닙니다." });
  }
}

export async function logout(req: Request, res: Response) {
  const clear = () => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "로그아웃 완료" });
  };

  req.session.destroy(clear);
}
