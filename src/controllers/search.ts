import { Request, Response } from "express";

import * as service from "@/services/search";

import * as Types from "@/types/search";

export async function searching(req: Request<{}, {}, {}, Types.SearchQueryParams>, res: Response) {
  const userId = req.session.user?.id;
  const q = req.query.q;

  try {
    const users = await service.searching({ q, userId });
    res.json(users);
  } catch {
    res.json([]);
  }
}
