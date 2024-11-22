import { postsCollection } from '@/DB';
import { IPost } from '@/types/posts/post';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ObjectId, WithId } from 'mongodb';
import { postObjMapper } from '@/util/postObjMapper';
import { IBaseQuery } from '@/types/base-query';
import { buildQuery } from '@/util/buildQuery';
import { IBaseResponse } from '@/types/base-response';

const getAllPosts = async ({ pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPost>>): Promise<IBaseResponse<WithId<IPost>>> => {
  const { sortOptions, skip, limit } = buildQuery<IPost>({ pageNumber, pageSize, sortBy, sortDirection });

  const items = await postsCollection.find({}).sort(sortOptions).skip(skip).limit(limit).toArray();

  const totalCount = await postsCollection.countDocuments();
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
};

const getPostById = async (postId: ObjectId): Promise<WithId<IPost> | null> => {
  return await postsCollection.findOne({ _id: new ObjectId(postId) });
};

const getPostsForBlog = async (blogId: ObjectId, { pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<IPost>>): Promise<IBaseResponse<WithId<IPost>>> => {
  const { sortOptions, skip, limit } = buildQuery<IPost>({ pageNumber, pageSize, sortBy, sortDirection });

  const posts = await postsCollection.find({ blogId }).sort(sortOptions).skip(skip).limit(limit).toArray();

  const totalCount = await postsCollection.countDocuments({ blogId });
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items: posts,
  };
};

const createPost = async (post: IPost): Promise<WithId<IPost>> => {
  const res = await postsCollection.insertOne(post);
  return { ...post, _id: res.insertedId };
};

const updatePost = async (postId: ObjectId, newPost: IUpdatePostBody): Promise<void> => {
  await postsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: newPost });
};

const deletePost = async (postId: ObjectId): Promise<void> => {
  await postsCollection.deleteOne({ _id: new ObjectId(postId) });
};

export default {
  getAllPosts,
  getPostById,
  getPostsForBlog,
  createPost,
  updatePost,
  deletePost,
};
