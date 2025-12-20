import express from "express";

import * as controller from "@/controllers";

const router = express();

router.post("/", controller.addFollows);

router.delete("/:targetId", controller.unFollows);

export default router;
