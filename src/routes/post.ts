import express from "express";

import upload from "@/upload/config";

import * as controller from "@/controllers";

const router = express();

router.get("/list/:author", controller.getPosts);

router.get("/detail/:postId", controller.getPost);

router.post("/create", upload.single("image"), controller.createPost);

router.patch("/edit/:postId", controller.editPost);

router.delete("/delete/:postId", controller.deletePost);

export default router;
