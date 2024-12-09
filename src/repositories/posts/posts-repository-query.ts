import { IBaseQuery } from '@/types/base-query';
import { buildQuery } from '@/util/buildQuery';
import { IBaseResponse } from '@/types/base-response';
import { IPostDB, IPostView } from '@/types/posts/post';
import { PostModel } from '@/DB/models/posts-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { postObjMapper } from '@/util/mappers/postObjMapper';
import { LikeModel } from '@/DB/models/likes-model';
import { LikeStatus } from '@/const/likes/like-status';

export class PostsRepositoryQuery {
  async getAllPosts({ pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPostDB>>, currentUserId?: MongooseObjtId): Promise<IBaseResponse<IPostView>> {
    const { sortOptions, skip, limit } = buildQuery<IPostDB>({ pageNumber, pageSize, sortBy, sortDirection });

    const posts = await PostModel.find({}).sort(sortOptions).skip(skip).limit(limit).lean();

    const totalCount = await PostModel.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postIds = posts.map((post) => post._id);
    const likes = await LikeModel.find({ likedEntityId: { $in: postIds } }).sort({ updatedAt: -1 }).lean();

    const postsLikesInfo = postIds.map((postId) => {
      const allPostLikes = likes.filter((like) => like.likedEntityId.equals(postId));
      const postLikes = allPostLikes.filter((like) => like.status === LikeStatus.Like)

      const likesCount = postLikes.length;
      const dislikesCount = allPostLikes.filter((like) => like.status === LikeStatus.Dislike).length;
      const myStatus = allPostLikes.find((like) => currentUserId?.toString() === like.userId.toString())?.status ?? LikeStatus.None;
      const newestLikes = postLikes.slice(0, 3);

      return {
        postId,
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes
      };
    });

    const finalItems = posts.map((basePost) => {
      const { likesCount, dislikesCount, myStatus, newestLikes } = postsLikesInfo.find((post) => post.postId.equals(basePost._id))!;
      return {
        ...basePost,
        extendedLikesInfo: { likesCount, dislikesCount, myStatus, newestLikes },
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: finalItems.map(postObjMapper),
    };
  }

  async getPostById(postId: MongooseObjtId, currentUserId?: MongooseObjtId): Promise<IPostView | null> {
    const post = await PostModel.findOne({ _id: postId }).lean();
    if (!post) return null;

    const allPostLikes = await LikeModel.find({ likedEntityId: postId }).sort({ updatedAt: -1 }).lean();

    const likes = allPostLikes.filter(like => like.status === LikeStatus.Like)
    const dislikes = allPostLikes.filter(like => like.status === LikeStatus.Dislike);
    const myStatus = allPostLikes.find((like) => currentUserId?.toString() === like.userId.toString())?.status ?? LikeStatus.None;
    const newestLikes = likes.slice(0, 3);

    return postObjMapper({
      ...post,
      extendedLikesInfo: { likesCount: likes.length, dislikesCount: dislikes.length, myStatus, newestLikes },
    });

  }

  async getPostsForBlog(
    blogId: MongooseObjtId,
    { pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPostDB>>,
    currentUserId?: MongooseObjtId
  ): Promise<IBaseResponse<IPostView>> {
    const { sortOptions, skip, limit } = buildQuery<IPostDB>({ pageNumber, pageSize, sortBy, sortDirection });

    const posts = await PostModel.find({ blogId }).sort(sortOptions).skip(skip).limit(limit);

    const totalCount = await PostModel.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    
    const postIds = posts.map((post) => post._id);
    const likes = await LikeModel.find({ likedEntityId: { $in: postIds } }).sort({ updatedAt: -1 }).lean();

    const postsLikesInfo = postIds.map((postId) => {
      const allPostLikes = likes.filter((like) => like.likedEntityId.equals(postId));
      const postLikes = allPostLikes.filter((like) => like.status === LikeStatus.Like)

      const likesCount = postLikes.length;
      const dislikesCount = allPostLikes.filter((like) => like.status === LikeStatus.Dislike).length;
      const myStatus = allPostLikes.find((like) => currentUserId?.toString() === like.userId.toString())?.status ?? LikeStatus.None;
      const newestLikes = postLikes.slice(0, 3);

      return {
        postId,
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes
      };
    });

    const finalItems = posts.map((basePost) => {
      const { likesCount, dislikesCount, myStatus, newestLikes } = postsLikesInfo.find((post) => post.postId.equals(basePost._id))!;
      return {
        ...basePost,
        extendedLikesInfo: { likesCount, dislikesCount, myStatus, newestLikes },
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: finalItems.map(postObjMapper),
    };
  }
}
