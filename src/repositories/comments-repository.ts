import { commentsCollection } from '@/DB';
import { IComment } from '@/types/comments/comment';
import { IUpdateCommentBody } from '@/types/comments/updateCommentBody';
import { Filter, ObjectId, WithId } from 'mongodb';

const getCommentById = async (commentId: ObjectId): Promise<WithId<IComment> | null> => {
  return await commentsCollection.findOne({ _id: new ObjectId(commentId) });
};

const updateComment = async (commentId: ObjectId, newComment: IUpdateCommentBody): Promise<void> => {
  await commentsCollection.updateOne({ _id: new ObjectId(commentId) }, { $set: newComment });
};

const deleteComment = async (commentId: ObjectId): Promise<void> => {
  await commentsCollection.deleteOne({ _id: new ObjectId(commentId) });
};

export default {
  getCommentById,
  updateComment,
  deleteComment,
};
