import express from "express";

import upload from "@/upload/config";

import * as controller from "@/controllers";

const router = express.Router();

router.get("/info/:userId", controller.getProfile);

router.patch("/edit", upload.single("image"), controller.editProfile);

export default router;
