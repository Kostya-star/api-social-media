import { commentsCollection } from '@/DB';
import { IComment } from '@/types/comments/comment';
import { ICommentBody } from '@/types/comments/commentBody';
import { ObjectId, WithId } from 'mongodb';

const getCommentById = async (commentId: ObjectId): Promise<WithId<IComment> | null> => {
  return await commentsCollection.findOne({ _id: new ObjectId(commentId) });
};

const createComment = async (postComment: IComment): Promise<WithId<IComment>> => {
  const res = await commentsCollection.insertOne(postComment);
  return { ...postComment, _id: res.insertedId };
};

const updateComment = async (commentId: ObjectId, newComment: ICommentBody): Promise<void> => {
  await commentsCollection.updateOne({ _id: new ObjectId(commentId) }, { $set: newComment });
};

const deleteComment = async (commentId: ObjectId): Promise<void> => {
  await commentsCollection.deleteOne({ _id: new ObjectId(commentId) });
};

export default {
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
