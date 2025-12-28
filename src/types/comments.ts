interface CommentsServiceParams {
  author: string;
  postId: string;
  content: string;
}

type CommentsParams = Omit<CommentsServiceParams, "userId">;
