import { Request, Response } from "express";

import * as service from "@/services";

export async function getFeeds(req: Request, res: Response) {
  const userId = req.session.user?.id;

  try {
    const feeds = await service.getFeeds({ userId });
    res.status(200).json(feeds);
  } catch (e) {
    res.status(500).json({ message: "피드 목록을 불러오는데 실패하였습니다." });
  }
}
