import mongoose from "mongoose";

// Models
import Post from "@/models/post";
import User from "@/models/user";
import Likes from "@/models/likes";

// Types
import * as Types from "@/types/post";

/**
 * 작성자를 기준으로 MongoDB에서 게시글 목록을 조회합니다.
 * @param author 작성자 ID
 * @returns 조회된 게시글 목록을 반환합니다.
 */
export async function getPosts({
  userId,
  author,
}: Types.GetPostsServiceParams): Promise<Types.Post[]> {
  const post = await Post.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(author) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "likes",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$postId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "liked",
      },
    },
    { $addFields: { isLiked: { $gt: [{ $size: "$liked" }, 0] } } },
    { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } },
    { $unwind: "$author" },
    {
      $project: {
        id: "$_id",
        content: 1,
        image: 1,
        createdAt: 1,
        author: { id: "$author._id", nickname: 1, profile: 1 },
        likeCount: 1,
        commentCount: 1,
        isLiked: 1,
      },
    },
  ]);

  return post;
}

export async function getPost({ postId }: Types.GetPostParams): Promise<Types.Post> {
  const post = await Post.findById(postId).populate({
    path: "author",
    select: "id nickname profile",
  });

  if (!post) {
    throw new Error("존재하지 않거나 삭제된 게시글입니다.");
  }

  return post;
}

/**
 * 작성한 게시글을 MongoDB에 저장합니다.
 * @param author 작성자 ID
 * @param content 내용
 * @param createdAt 작성 시간
 * @param image 게시글 이미지
 */
export async function createPost({
  author,
  content,
  createdAt,
  image,
}: Types.CreateServiceParam): Promise<Types.Post> {
  const created = await Post.create({ author, content, createdAt, image });
  const post = await created.populate({ path: "author", select: "id nickname profile" });

  if (post._id) {
    await User.updateOne({ _id: author }, { $inc: { postCount: 1 } });
  }

  return post;
}

/**
 * 게시글 ID와 작성자 ID를 기준으로 게시글을 삭제합니다.
 * @param postId 게시글 ID
 * @param author 작성자 ID
 */
export async function deletePost({ postId, author }: Types.DeleteParams): Promise<Types.Post> {
  const deleted = await Post.findOneAndDelete({ _id: postId, author }, { new: true });

  if (!deleted) {
    throw new Error("게시글 삭제를 실패하였습니다.");
  }

  await Likes.deleteMany({ postId: deleted.id }, { new: true });
  await User.updateOne({ _id: author }, { $inc: { postCount: -1 } });
  return deleted;
}

export async function editPost({ postId, content }: Types.EditPostParams): Promise<Types.Post> {
  const result = await Post.findByIdAndUpdate(
    postId,
    { $set: { content } },
    { new: true }
  ).populate({ path: "author", select: "id nickname profile" });

  if (!result) {
    throw new Error("게시글 업데이트에 실패하였습니다.");
  }

  return result;
}
