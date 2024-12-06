import { ICommentDB, ICommentView } from '@/types/comments/comment';
import { ILikesInfoView } from '@/types/likes/like';

interface ICommentDBWIthLikesInfo extends ICommentDB, ILikesInfoView {}

export function commentObjMapper(comment: ICommentDBWIthLikesInfo): ICommentView {
  return {
    id: comment._id,
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: comment.likesInfo.myStatus,
    },
    createdAt: comment.createdAt,
  };
}
