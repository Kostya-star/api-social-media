import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IPost } from '@/types/posts/post';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { blogsCollection, postsCollection } from '@/DB';
import { ObjectId } from 'mongodb';
import PostsRepository from '@/repositories/posts-repository';

const getAllPosts = async (): Promise<IPost[]> => {
  return PostsRepository.getAllPosts();
};

const getPostById = async (postId: string): Promise<IPost> => {
  return await PostsRepository.getPostById(postId);
};

const createPost = async (post: ICreatePostBody): Promise<IPost> => {
  return PostsRepository.createPost(post);
};

const updatePost = async (postId: string, newPost: IUpdatePostBody): Promise<void> => {
  return await PostsRepository.updatePost(postId, newPost);
};

const deletePost = async (postId: string): Promise<void> => {
  return await PostsRepository.deletePost(postId);
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
