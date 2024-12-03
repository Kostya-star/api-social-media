import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { IBaseQuery } from '@/types/base-query';
import { buildQuery } from '@/util/buildQuery';
import { IBaseResponse } from '@/types/base-response';
import { IPostDB } from '@/types/posts/post';
import { PostModel } from '@/models/posts-model';
import { Types } from 'mongoose';
import { ICreatePostBody } from '@/types/posts/createPostBody';

type ObjectId = Types.ObjectId;

const getAllPosts = async ({ pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPostDB>>): Promise<IBaseResponse<IPostDB>> => {
  const { sortOptions, skip, limit } = buildQuery<IPostDB>({ pageNumber, pageSize, sortBy, sortDirection });

  const items = await PostModel.find({}).sort(sortOptions).skip(skip).limit(limit);

  const totalCount = await PostModel.countDocuments();
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
};

const getPostById = async (postId: ObjectId): Promise<IPostDB | null> => {
  return await PostModel.findOne({ _id: postId });
};

const getPostsForBlog = async (
  blogId: ObjectId,
  { pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPostDB>>
): Promise<IBaseResponse<IPostDB>> => {
  const { sortOptions, skip, limit } = buildQuery<IPostDB>({ pageNumber, pageSize, sortBy, sortDirection });

  const posts = await PostModel.find({ blogId }).sort(sortOptions).skip(skip).limit(limit);

  const totalCount = await PostModel.countDocuments({ blogId });
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items: posts,
  };
};

const createPost = async (post: ICreatePostBody & { blogName: string }): Promise<IPostDB> => {
  return await PostModel.create(post);
};

const updatePost = async (postId: ObjectId, updates: IUpdatePostBody): Promise<void> => {
  await PostModel.updateOne({ _id: postId }, updates);
};

const deletePost = async (postId: ObjectId): Promise<void> => {
  await PostModel.deleteOne({ _id: postId });
};

export default {
  getAllPosts,
  getPostById,
  getPostsForBlog,
  createPost,
  updatePost,
  deletePost,
};
