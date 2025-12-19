import { Request, Response } from "express";

import * as service from "@/services";

import * as Types from "@/types/follows";

export async function addFollows(req: Request<{}, {}, Types.AddFollowsParams>, res: Response) {
  const userId = req.session.user?.id;
  const targetId = req.body.targetId;

  try {
    await service.addFollows({ userId, targetId });
    res.status(200).json({ message: "팔로우 완료" });
  } catch (e) {
    res.status(500).json({ message: "팔로우 요청을 실패하였습니다." });
  }
}
