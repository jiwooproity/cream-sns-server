import { Request, Response } from "express";

import * as service from "@/services";

import * as Types from "@/types/post";

import { deleteInCloudinary, uploadToCloudinary } from "@/upload/cloudinary";

export async function getPosts(req: Request<Types.GetPostsParams>, res: Response) {
  const userId = req.session.user?.id;
  const author = req.params.author;

  try {
    const posts = await service.getPosts({ userId, author });
    res.status(200).json(posts);
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: "게시글 목록을 불러오는데 실패하였습니다." });
  }
}

export async function getPost(req: Request<Types.GetPostParams>, res: Response) {
  const postId = req.params.postId;

  try {
    const post = await service.getPost({ postId });
    res.status(200).json(post);
  } catch (e) {
    if (e instanceof Error) res.status(500).json({ message: e.message });
  }
}

export async function createPost(req: Request<{}, {}, Types.CreateParams>, res: Response) {
  const author = req.session.user?.id;

  const { file } = req;
  const { content, createdAt } = req.body;

  const image = await uploadToCloudinary(file!, { folder: "cream/post" });

  try {
    const post = await service.createPost({ author, content, createdAt, image });
    res.status(200).json(post);
  } catch (e) {
    if (image?.public_id) deleteInCloudinary(image.public_id);
    res.status(500).json({ message: "게시글 업로드에 실패하였습니다." });
  }
}

export async function deletePost(req: Request<Types.DeleteParams>, res: Response) {
  const postId = req.params.postId;
  const author = req.session.user?.id;

  try {
    const { image } = await service.deletePost({ postId, author });
    if (image?.public_id) deleteInCloudinary(image?.public_id);
    res.sendStatus(200);
  } catch (e) {
    if (e instanceof Error) res.status(500).json({ message: e.message });
  }
}

export async function editPost(
  req: Request<{ postId: string }, {}, { content: string }>,
  res: Response
) {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const post = await service.editPost({ postId, content });
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ message: "게시글 수정에 실패하였습니다." });
  }
}
