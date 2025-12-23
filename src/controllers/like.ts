import { Request, Response } from "express";

import * as service from "@/services";

export async function getLikes(req: Request<{ userId: string }>, res: Response) {
  const userId = req.params.userId;
  const myId = req.session.user?.id;

  try {
    const likes = await service.getLikes({ userId, myId });
    res.status(200).json(likes);
  } catch (e) {
    res.status(500).json({ message: "좋아요 리스트를 불러오는데 실패하였습니다." });
  }
}

export async function addLike(req: Request<{}, {}, { postId: string }>, res: Response) {
  const userId = req.session.user?.id;
  const postId = req.body.postId;

  try {
    await service.addLike({ userId, postId });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ message: "좋아요 처리가 실패하였습니다." });
  }
}

export async function removeLike(req: Request<{}, {}, { postId: string }>, res: Response) {
  const userId = req.session.user?.id;
  const postId = req.body.postId;

  try {
    await service.removeLike({ userId, postId });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ message: "좋아요 취소에 실패하였습니다." });
  }
}
