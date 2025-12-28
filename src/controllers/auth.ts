import { Request, Response } from "express";

import bcrypt from "bcrypt";

import * as service from "@/services";

import * as Types from "@/types/auth";

export async function signUp(req: Request<{}, {}, Types.SignUpParams>, res: Response) {
  const { userId, nickname, password } = req.body;

  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);

  try {
    await service.signUp({ userId, nickname, password: hashed });
    res.sendStatus(200);
  } catch (e) {
    if (e instanceof Error) res.status(409).json({ message: e.message });
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
  const clear = (err: any) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃을 실패하였습니다." });
    }

    res.clearCookie("connect.sid");
    res.status(200).json({ message: "로그아웃 완료" });
  };

  req.session.destroy(clear);
}
