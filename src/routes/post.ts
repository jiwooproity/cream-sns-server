import express from "express";

// Parser
import upload from "@/upload/config";

// Model
import Post from "@/models/post";

// Upload
import { deleteInCloudinary, uploadToCloudinary } from "@/upload/uploadToCloudinary";

const router = express();

async function getPosts(userId: string) {
  const posts = await Post.find({ userId }, "-image._id");

  return posts.map((post) => ({
    postId: post.id,
    content: post.content,
    image: post.image,
  }));
}

router.get("/list", async (req, res) => {
  const userId = req.session.user?.id;

  try {
    const posts = await getPosts(userId);
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ message: "포스트 목록을 불러오는데 실패하였습니다." });
  }
});

router.post("/create", upload.single("image"), async (req, res) => {
  const { file } = req;
  const { content } = req.body;

  const userId = req.session.user?.id;

  const image = await uploadToCloudinary(file!, { folder: "cream/post" });

  try {
    const post = new Post({ userId, image, content });
    await post.save();

    const posts = await getPosts(userId);
    res.status(200).json(posts);
  } catch (e) {
    if (image?.public_id) deleteInCloudinary(image.public_id);
    res.status(500).json({ message: "포스트 업로드에 실패하였습니다." });
  }
});

router.patch("/edit", async (req, res) => {});

router.delete("/delete", async (req, res) => {});

export default router;
