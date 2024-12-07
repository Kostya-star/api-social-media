import { LikeStatus } from '@/const/likes/like-status';
import { CommentModel } from '@/DB/models/comments-model';
import { LikeModel } from '@/DB/models/likes-model';
import { IBaseQuery } from '@/types/base-query';
import { IBaseResponse } from '@/types/base-response';
import { ICommentDB, ICommentView } from '@/types/comments/comment';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { buildQuery } from '@/util/buildQuery';
import { commentObjMapper } from '@/util/mappers/commentObjMapper';

export class CommentsRepositoryQuery {
  async getCommentsForPost(
    query: Required<IBaseQuery<ICommentDB>>,
    postId: MongooseObjtId,
    currentUserId?: MongooseObjtId
  ): Promise<IBaseResponse<ICommentView>> {
    const { sortOptions, skip, limit } = buildQuery<ICommentDB>(query);

    const items = await CommentModel.find({ postId }).sort(sortOptions).skip(skip).limit(limit).lean();

    const totalCount = await CommentModel.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / query.pageSize);

    const commentIds = items.map((comm) => comm._id);
    const likes = await LikeModel.find({ likedEntityId: { $in: commentIds } }).lean();

    const commentsLikesInfo = commentIds.map((commentId) => {
      const commentLikes = likes.filter((like) => like.likedEntityId.equals(commentId));

      const likesCount = commentLikes.filter((like) => like.status === LikeStatus.Like).length;
      const dislikesCount = commentLikes.filter((like) => like.status === LikeStatus.Dislike).length;

      const myStatus = commentLikes.find((like) => currentUserId?.toString() === like.userId.toString())?.status ?? LikeStatus.None;
      return {
        commentId,
        likesCount,
        dislikesCount,
        myStatus,
      };
    });

    const finalItems = items.map((baseComm) => {
      const { likesCount, dislikesCount, myStatus } = commentsLikesInfo.find((comm) => comm.commentId.equals(baseComm._id))!;
      return {
        ...baseComm,
        likesInfo: { likesCount, dislikesCount, myStatus },
      };
    });

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: finalItems.map(commentObjMapper),
    };
  }

  async getCommentById(commentId: MongooseObjtId, currentUserId?: MongooseObjtId): Promise<ICommentView | null> {
    const comment = await CommentModel.findOne({ _id: commentId }).lean();
    if (!comment) return null;

    const likesCount = await LikeModel.countDocuments({ likedEntityId: commentId, status: LikeStatus.Like });
    const dislikesCount = await LikeModel.countDocuments({ likedEntityId: commentId, status: LikeStatus.Dislike });
    const myStatus = (await LikeModel.findOne({ likedEntityId: commentId, userId: currentUserId }).lean())?.status ?? LikeStatus.None;

    return commentObjMapper({
      ...comment,
      likesInfo: { likesCount, dislikesCount, myStatus },
    });
  }
}
