import { IBaseQuery } from '@/types/base-query';
import { buildQuery } from '@/util/buildQuery';
import { IBaseResponse } from '@/types/base-response';
import { IPostDB, IPostView } from '@/types/posts/post';
import { PostModel } from '@/DB/models/posts-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { postObjMapper } from '@/util/mappers/postObjMapper';

export class PostsRepositoryQuery {
  async getAllPosts({ pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPostDB>>): Promise<IBaseResponse<IPostView>> {
    const { sortOptions, skip, limit } = buildQuery<IPostDB>({ pageNumber, pageSize, sortBy, sortDirection });

    const items = await PostModel.find({}).sort(sortOptions).skip(skip).limit(limit);

    const totalCount = await PostModel.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: items.map(postObjMapper),
    };
  }

  async getPostById(postId: MongooseObjtId): Promise<IPostView | null> {
    const post = await PostModel.findOne({ _id: postId });
    return post ? postObjMapper(post) : null;
  }

  async getPostsForBlog(
    blogId: MongooseObjtId,
    { pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPostDB>>
  ): Promise<IBaseResponse<IPostView>> {
    const { sortOptions, skip, limit } = buildQuery<IPostDB>({ pageNumber, pageSize, sortBy, sortDirection });

    const posts = await PostModel.find({ blogId }).sort(sortOptions).skip(skip).limit(limit);

    const totalCount = await PostModel.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map(postObjMapper),
    };
  }
}
