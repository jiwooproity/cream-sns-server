import express from "express";

// Parser
import upload from "@/upload/config";

// Model
import Post from "@/models/post";

// Upload
import { deleteInCloudinary, uploadToCloudinary } from "@/upload/uploadToCloudinary";

const router = express();

async function getPosts(author: string) {
  const posts = await Post.find({ author }, "-image._id").sort({ createdAt: -1 });

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    image: post.image,
  }));
}

router.get("/list/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await getPosts(id);
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ message: "포스트 목록을 불러오는데 실패하였습니다." });
  }
});

router.post("/create", upload.single("image"), async (req, res) => {
  const { file } = req;
  const { content, createdAt } = req.body;

  const id = req.session.user?.id;

  const image = await uploadToCloudinary(file!, { folder: "cream/post" });

  try {
    const post = new Post({ author: id, image, content, createdAt });
    await post.save();

    const posts = await getPosts(id);
    res.status(200).json(posts);
  } catch (e) {
    if (image?.public_id) deleteInCloudinary(image.public_id);
    res.status(500).json({ message: "포스트 업로드에 실패하였습니다." });
  }
});

router.patch("/edit", async (req, res) => {});

router.delete("/delete", async (req, res) => {});

export default router;
