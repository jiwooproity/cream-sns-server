import { Request, Response } from "express";

import * as service from "@/services";

import * as Types from "@/types/follows";

export async function addFollows(req: Request<{}, {}, Types.FollowsParams>, res: Response) {
  const userId = req.session.user?.id;
  const targetId = req.body.targetId;

  try {
    await service.addFollows({ userId, targetId });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(200);
  }
}

export async function unFollows(req: Request<Types.FollowsParams>, res: Response) {
  const userId = req.session.user?.id;
  const targetId = req.params.targetId;

  try {
    await service.unFollows({ userId, targetId });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(200);
  }
}
