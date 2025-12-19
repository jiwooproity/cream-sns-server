import express from "express";

import * as controller from "@/controllers";

const router = express.Router();

router.get("/me", controller.me);

router.post("/signup", controller.signUp);

router.post("/login", controller.login);

router.post("/logout", controller.logout);

export default router;
