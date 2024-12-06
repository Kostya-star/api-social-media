import { CommentModel } from '@/models/comments-model';
import { ICommentDB } from '@/types/comments/comment';
import { ICommentPayload } from '@/types/comments/commentPayload';
import { MongooseObjtId } from '@/types/mongoose-object-id';

const getCommentById = async (commentId: MongooseObjtId): Promise<ICommentDB | null> => {
  return await CommentModel.findOne({ _id: commentId });
};

const createComment = async (postComment: ICommentPayload): Promise<MongooseObjtId> => {
  const comment = await CommentModel.create(postComment);
  return comment._id;
};

const updateComment = async (commentId: MongooseObjtId, updates: { content: string }): Promise<void> => {
  await CommentModel.updateOne({ _id: commentId }, updates);
};

const deleteComment = async (commentId: MongooseObjtId): Promise<void> => {
  await CommentModel.deleteOne({ _id: commentId });
};

export default {
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
