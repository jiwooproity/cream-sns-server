import express from "express";

import * as controller from "@/controllers";

const router = express();

router.get("/list", controller.getFeeds);

export default router;
