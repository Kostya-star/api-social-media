import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { IPostDB } from '@/types/posts/post';
import { PostModel } from '@/DB/models/posts-model';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { MongooseObjtId } from '@/types/mongoose-object-id';

const getPostById = async (postId: MongooseObjtId): Promise<IPostDB | null> => {
  return await PostModel.findOne({ _id: postId });
};

const createPost = async (newPost: ICreatePostBody & { blogName: string }): Promise<MongooseObjtId> => {
  const post = await PostModel.create(newPost);
  return post._id;
};

const updatePost = async (postId: MongooseObjtId, updates: IUpdatePostBody): Promise<void> => {
  await PostModel.updateOne({ _id: postId }, updates);
};

const deletePost = async (postId: MongooseObjtId): Promise<void> => {
  await PostModel.deleteOne({ _id: postId });
};

export default {
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
