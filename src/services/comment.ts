import Comments from "@/models/comments";
import Post from "@/models/post";

export async function getComments({ postId }: { postId: string }) {
  return await Comments.find({ postId }).populate({
    path: "author",
    select: "id nickname profile",
  });
}

export async function addComment({ author, postId, content }: CommentsServiceParams) {
  const created = await Comments.create({ author, postId, content });
  if (!created) throw new Error("댓글 작성을 실패하였습니다.");
  await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
}
