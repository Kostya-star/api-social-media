import { IPost } from '@/types/posts/post';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ObjectId } from 'mongodb';
import PostsRepository from '@/repositories/posts-repository';
import { ErrorService } from './error-service';
import { PostsErrorsList } from '@/errors/posts-errors';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import BlogsRepository from '@/repositories/blogs-repository';

const getAllPosts = async (): Promise<IPost[]> => {
  return await PostsRepository.getAllPosts();
};

const getPostById = async (postId: ObjectId): Promise<IPost> => {
  if (!ObjectId.isValid(postId)) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const post = await PostsRepository.getPostById(postId);

  if (!post) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  return post;
};

const createPost = async (post: ICreatePostBody): Promise<IPost> => {
  // no errors should occur here coz previusly it was assured the post.blogId should exist and be valid
  const blogName = (await BlogsRepository.getBlogById(post.blogId))!.name;

  const newPost: IPost = { ...post, createdAt: new Date(), blogName };
  return await PostsRepository.createPost(newPost);
};

const updatePost = async (postId: ObjectId, newPost: IUpdatePostBody): Promise<void> => {
  if (!ObjectId.isValid(postId)) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const postToUpdate = await PostsRepository.getPostById(postId)

  if (!postToUpdate) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await PostsRepository.updatePost(postId, newPost);
};

const deletePost = async (postId: ObjectId): Promise<void> => {
  if (!ObjectId.isValid(postId)) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const postToDelete = await PostsRepository.getPostById(postId)

  if (!postToDelete) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await PostsRepository.deletePost(postId);
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
