import { IComment } from '@/types/comments/comment';
import { WithId } from 'mongodb';

// map the response and get rid of _id
export function commentObjMapper(comment: WithId<IComment>): IComment {
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
