import { IPost } from '@/types/posts/post';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ObjectId } from 'mongodb';
import PostsRepository from '@/repositories/posts-repository';

const getAllPosts = async (): Promise<IPost[]> => {
  return PostsRepository.getAllPosts();
};

const getPostById = async (postId: ObjectId): Promise<IPost> => {
  return await PostsRepository.getPostById(postId);
};

const createPost = async (post: ICreatePostBody): Promise<IPost> => {
  return PostsRepository.createPost(post);
};

const updatePost = async (postId: ObjectId, newPost: IUpdatePostBody): Promise<void> => {
  return await PostsRepository.updatePost(postId, newPost);
};

const deletePost = async (postId: ObjectId): Promise<void> => {
  return await PostsRepository.deletePost(postId);
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
