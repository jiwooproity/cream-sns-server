import express from "express";

import * as controller from "@/controllers/comment";

const router = express.Router();

router.get("/:postId", controller.getComments);

router.post("/:postId", controller.addComment);

export default router;
