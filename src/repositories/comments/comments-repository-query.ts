import { CommentModel } from '@/models/comments-model';
import { IBaseQuery } from '@/types/base-query';
import { IBaseResponse } from '@/types/base-response';
import { ICommentDB, ICommentView } from '@/types/comments/comment';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { buildQuery } from '@/util/buildQuery';
import { commentObjMapper } from '@/util/mappers/commentObjMapper';

const getCommentsForPost = async (query: Required<IBaseQuery<ICommentDB>>, postId: MongooseObjtId): Promise<IBaseResponse<ICommentView>> => {
  const { sortOptions, skip, limit } = buildQuery<ICommentDB>(query);

  const items = await CommentModel.find({ postId }).sort(sortOptions).skip(skip).limit(limit);

  const totalCount = await CommentModel.countDocuments({ postId });
  const pagesCount = Math.ceil(totalCount / query.pageSize);

  return {
    pagesCount,
    page: query.pageNumber,
    pageSize: query.pageSize,
    totalCount,
    items: items.map(commentObjMapper),
  };
};

const getCommentById = async (commentId: MongooseObjtId): Promise<ICommentView | null> => {
  const comment = await CommentModel.findOne({ _id: commentId });
  return comment ? commentObjMapper(comment) : null;
};

export default {
  getCommentsForPost,
  getCommentById,
};
