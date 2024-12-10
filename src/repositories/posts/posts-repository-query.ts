import { IBaseQuery } from '@/types/base-query';
import { buildQuery } from '@/util/buildQuery';
import { IBaseResponse } from '@/types/base-response';
import { IPostDB, IPostView } from '@/types/posts/post';
import { PostModel } from '@/DB/models/posts-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { postObjMapper } from '@/util/mappers/postObjMapper';
import { LikeModel } from '@/DB/models/likes-model';
import { getLikesInfo } from '@/util/get-likes-info';
import { injectable } from 'inversify';

@injectable()
export class PostsRepositoryQuery {
  async getAllPosts(
    { pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPostDB>>,
    currentUserId?: MongooseObjtId
  ): Promise<IBaseResponse<IPostView>> {
    const { sortOptions, skip, limit } = buildQuery<IPostDB>({ pageNumber, pageSize, sortBy, sortDirection });

    const posts = await PostModel.find({}).sort(sortOptions).skip(skip).limit(limit).lean();

    const totalCount = await PostModel.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postIds = posts.map((post) => post._id);
    const likes = await LikeModel.find({ likedEntityId: { $in: postIds } })
      .sort({ updatedAt: -1 })
      .lean();

    const postsLikesInfo = postIds.map((postId) => {
      const allPostLikes = likes.filter((like) => like.likedEntityId.equals(postId));
      const likesInfo = getLikesInfo(allPostLikes, currentUserId);

      return { postId, ...likesInfo };
    });

    const finalItems = posts.map((basePost) => {
      const { likesCount, dislikesCount, myStatus, newestLikes } = postsLikesInfo.find((post) => post.postId.equals(basePost._id))!;
      return {
        ...basePost,
        extendedLikesInfo: { likesCount, dislikesCount, myStatus, newestLikes },
      };
    });

    return { pagesCount, page: pageNumber, pageSize, totalCount, items: finalItems.map(postObjMapper) };
  }

  async getPostById(postId: MongooseObjtId, currentUserId?: MongooseObjtId): Promise<IPostView | null> {
    const post = await PostModel.findOne({ _id: postId }).lean();
    if (!post) return null;

    const allLikes = await LikeModel.find({ likedEntityId: postId }).sort({ updatedAt: -1 }).lean();

    const extendedLikesInfo = getLikesInfo(allLikes, currentUserId);

    return postObjMapper({ ...post, extendedLikesInfo });
  }

  async getPostsForBlog(
    blogId: MongooseObjtId,
    { pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPostDB>>,
    currentUserId?: MongooseObjtId
  ): Promise<IBaseResponse<IPostView>> {
    const { sortOptions, skip, limit } = buildQuery<IPostDB>({ pageNumber, pageSize, sortBy, sortDirection });

    const posts = await PostModel.find({ blogId }).sort(sortOptions).skip(skip).limit(limit).lean();

    const totalCount = await PostModel.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postIds = posts.map((post) => post._id);
    const likes = await LikeModel.find({ likedEntityId: { $in: postIds } })
      .sort({ updatedAt: -1 })
      .lean();

    const postsLikesInfo = postIds.map((postId) => {
      const allPostLikes = likes.filter((like) => like.likedEntityId.equals(postId));
      const likesInfo = getLikesInfo(allPostLikes, currentUserId);

      return { postId, ...likesInfo };
    });

    const finalItems = posts.map((basePost) => {
      const { likesCount, dislikesCount, myStatus, newestLikes } = postsLikesInfo.find((post) => post.postId.equals(basePost._id))!;
      return {
        ...basePost,
        extendedLikesInfo: { likesCount, dislikesCount, myStatus, newestLikes },
      };
    });

    return { pagesCount, page: pageNumber, pageSize, totalCount, items: finalItems.map(postObjMapper) };
  }
}
