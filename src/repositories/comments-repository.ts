import { LikeStatus } from '@/const/likes/like-status';
import { CommentModel } from '@/models/comments-model';
import { LikeModel } from '@/models/likes-model';
import { IBaseQuery } from '@/types/base-query';
import { IBaseResponse } from '@/types/base-response';
import { ICommentDB } from '@/types/comments/comment';
import { ICommentPayload } from '@/types/comments/commentPayload';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { buildQuery } from '@/util/buildQuery';

const getCommentsForPost = async (query: Required<IBaseQuery<ICommentDB>>, postId: MongooseObjtId, currentUserId?: MongooseObjtId): Promise<IBaseResponse<ICommentDB>> => {
  const { sortOptions, skip, limit } = buildQuery<ICommentDB>(query);

  const items = await CommentModel.find({ postId }).sort(sortOptions).skip(skip).limit(limit);

  const totalCount = await CommentModel.countDocuments({ postId });
  const pagesCount = Math.ceil(totalCount / query.pageSize);

  const commentIds = items.map(comm => comm._id)
  const likes = await LikeModel.find({ likedEntityId: { $in: commentIds } });

  const commentsLikesInfo = commentIds.map((commentId) => {
    const commentLikes = likes.filter((like) => like.likedEntityId.equals(commentId));

    const likesCount = commentLikes.filter((like) => like.status === LikeStatus.Like).length;
    const dislikesCount = commentLikes.filter((like) => like.status === LikeStatus.Dislike).length;
    const myStatus = commentLikes.find(like => 
      currentUserId?.equals(like.userId))?.status ?? LikeStatus.None;
    return {
      commentId,
      likesCount,
      dislikesCount,
      myStatus
    };
  });

  const finalItems = items.map(baseComm => {
    const { likesCount, dislikesCount, myStatus } = commentsLikesInfo.find(comm => comm.commentId.equals(baseComm._id))!
    return {
      ...baseComm,
      likesInfo: { likesCount, dislikesCount, myStatus }
    }
  })

  return {
    pagesCount,
    page: query.pageNumber,
    pageSize: query.pageSize,
    totalCount,
    items: finalItems,
  };
};

const getCommentById = async (commentId: MongooseObjtId, currentUserId?: MongooseObjtId): Promise<ICommentDB | null> => {
  const comment = await CommentModel.findOne({ _id: commentId });

  const likesCount = await LikeModel.countDocuments({ likedEntityId: commentId, status: LikeStatus.Like });
  const dislikesCount = await LikeModel.countDocuments({ likedEntityId: commentId, status: LikeStatus.Dislike });
  const myStatus = (await LikeModel.findOne({ likedEntityId: commentId, userId: currentUserId }))?.status ?? LikeStatus.None
  if (!comment) return null 
  else return {
    ...comment,
    likesInfo: {
      likesCount,
      dislikesCount,
      myStatus
    }
  }
};

const createComment = async (postComment: ICommentPayload): Promise<ICommentDB> => {
  return await CommentModel.create(postComment);
};

const updateComment = async (commentId: MongooseObjtId, updates: { content: string }): Promise<void> => {
  await CommentModel.updateOne({ _id: commentId }, updates);
};

const deleteComment = async (commentId: MongooseObjtId): Promise<void> => {
  await CommentModel.deleteOne({ _id: commentId });
};

export default {
  getCommentsForPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
