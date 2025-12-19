import express from "express";

import * as controller from "@/controllers";

const router = express();

router.post("/add", controller.addFollows);

export default router;
