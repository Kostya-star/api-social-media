import { commentsCollection } from '@/DB';
import { IBaseQuery } from '@/types/base-query';
import { IBaseResponse } from '@/types/base-response';
import { IComment } from '@/types/comments/comment';
import { ICommentBody } from '@/types/comments/commentBody';
import { buildQuery } from '@/util/buildQuery';
import { ObjectId, WithId } from 'mongodb';

const getCommentsForPost = async (query: Required<IBaseQuery<IComment>>, postId: ObjectId): Promise<IBaseResponse<WithId<IComment>>> => {
  const { sortOptions, skip, limit } = buildQuery<IComment>(query);

  const items = await commentsCollection.find({ postId }).sort(sortOptions).skip(skip).limit(limit).toArray();

  const totalCount = await commentsCollection.countDocuments({ postId });
  const pagesCount = Math.ceil(totalCount / query.pageSize);

  return {
    pagesCount,
    page: query.pageNumber,
    pageSize: query.pageSize,
    totalCount,
    items,
  };
};

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
  getCommentsForPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
