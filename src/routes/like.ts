import express from "express";

import * as controller from "@/controllers";

const router = express.Router();

router.post("/add", controller.addLike);

router.delete("/remove", controller.removeLike);

export default router;
