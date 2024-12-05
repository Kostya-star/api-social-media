import { ICommentDB, ICommentView } from '@/types/comments/comment';

export function commentObjMapper(comment: ICommentDB): ICommentView {
  return {
    id: comment._id,
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  };
}
