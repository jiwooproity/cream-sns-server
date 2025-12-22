import { Request, Response } from "express";

import * as service from "@/services";

import * as Types from "@/types/like";

export async function addLike(req: Request<{}, {}, Types.LikeParams>, res: Response) {
  const userId = req.session.user?.id;
  const postId = req.body.postId;

  try {
    await service.addLike({ userId, postId });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ message: "좋아요 처리가 실패하였습니다." });
  }
}

export async function removeLike(req: Request<{}, {}, Types.LikeParams>, res: Response) {
  const userId = req.session.user?.id;
  const postId = req.body.postId;

  try {
    await service.removeLike({ userId, postId });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ message: "좋아요 취소에 실패하였습니다." });
  }
}
