import bcrypt from "bcrypt";

import User from "@/models/user";

import * as Types from "@/types/auth";

export async function signUp({ nickname, userId, password }: Types.SignUpParams) {
  const user = new User({ userId, nickname, password });
  await user.save();
}

export async function login({ userId, password }: Types.LoginParams): Promise<Types.User> {
  // 가입된 사용자 검색
  const user = await User.findOne({ userId });
  if (!user) throw new Error("존재하지 않는 사용자입니다.");

  // 비밀번호 매칭 확인
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) throw new Error("비밀번호가 일치하지 않습니다.");

  return user;
}
