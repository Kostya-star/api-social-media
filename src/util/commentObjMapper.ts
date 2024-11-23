import { IComment } from '@/types/comments/comment';
import { WithId } from 'mongodb';

type MapperResponse = Omit<IComment, 'postId' | '_id'>;

// map the response and get rid of _id
export function commentObjMapper(comment: WithId<IComment>): MapperResponse {
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
