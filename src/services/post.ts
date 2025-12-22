// Models
import Post from "@/models/post";
import User from "@/models/user";

// Types
import * as Types from "@/types/post";

/**
 * 작성자를 기준으로 MongoDB에서 게시글 목록을 조회합니다.
 * @param author 작성자 ID
 * @returns 조회된 게시글 목록을 반환합니다.
 */
export async function getPosts({ author }: Types.GetPostsParams): Promise<Types.Post[]> {
  return await Post.find({ author }, "-image._id")
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "id nickname profile" });
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
