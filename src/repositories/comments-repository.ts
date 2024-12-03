import { CommentModel } from '@/models/comments-model';
import { IBaseQuery } from '@/types/base-query';
import { IBaseResponse } from '@/types/base-response';
import { ICommentDB } from '@/types/comments/comment';
import { ICommentPayload } from '@/types/comments/commentPayload';
import { buildQuery } from '@/util/buildQuery';
import { Types } from 'mongoose';

type MObjectId = Types.ObjectId;

const getCommentsForPost = async (query: Required<IBaseQuery<ICommentDB>>, postId: MObjectId): Promise<IBaseResponse<ICommentDB>> => {
  const { sortOptions, skip, limit } = buildQuery<ICommentDB>(query);

  const items = await CommentModel.find({ postId }).sort(sortOptions).skip(skip).limit(limit);

  const totalCount = await CommentModel.countDocuments({ postId });
  const pagesCount = Math.ceil(totalCount / query.pageSize);

  return {
    pagesCount,
    page: query.pageNumber,
    pageSize: query.pageSize,
    totalCount,
    items,
  };
};

const getCommentById = async (commentId: MObjectId): Promise<ICommentDB | null> => {
  return await CommentModel.findOne({ _id: commentId });
};

const createComment = async (postComment: ICommentPayload): Promise<ICommentDB> => {
  return await CommentModel.create(postComment);
};

const updateComment = async (commentId: MObjectId, updates: { content: string }): Promise<void> => {
  await CommentModel.updateOne({ _id: commentId }, updates);
};

const deleteComment = async (commentId: MObjectId): Promise<void> => {
  await CommentModel.deleteOne({ _id: commentId });
};

export default {
  getCommentsForPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
