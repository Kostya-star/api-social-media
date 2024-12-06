import { LikeStatus } from '@/const/likes/like-status';
import { ICommentDB, ICommentView } from '@/types/comments/comment';

export function commentObjMapper(comment: ICommentDB): ICommentView {
  return {
    id: comment._id,
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    likesInfo: {
      likesCount: comment.likesInfo?.likesCount || 0,
      dislikesCount: comment.likesInfo?.dislikesCount || 0,
      myStatus: comment.likesInfo?.myStatus || LikeStatus.None
    },
    createdAt: comment.createdAt,
  };
}
