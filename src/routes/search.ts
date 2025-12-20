import express from "express";

import * as controller from "@/controllers";

const router = express.Router();

router.get("/", controller.searching);

export default router;
