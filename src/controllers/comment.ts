import { Request, Response } from "express";

import * as service from "@/services/comment";

export async function getComments(req: Request<{ postId: string }>, res: Response) {
  const postId = req.params.postId;

  try {
    const comments = await service.getComments({ postId });
    res.status(200).json(comments);
  } catch (e) {
    res.status(500).json({ message: "댓글 조회에 실패하였습니다." });
  }
}

export async function addComment(
  req: Request<{ postId: string }, {}, { content: string }>,
  res: Response
) {
  const author = req.session.user?.id;
  const postId = req.params.postId;
  const content = req.body.content;

  try {
    await service.addComment({ author, postId, content });
    res.sendStatus(200);
  } catch (e) {
    if (e instanceof Error) res.status(500).json({ message: e.message });
  }
}
