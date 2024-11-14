import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { blogsCollection, postsCollection } from '@/DB';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ErrorService } from '@/services/error-service';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IPost } from '@/types/posts/post';
import BlogsRepository from './blogs-repository';
import { v4 as uuidv4 } from 'uuid';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';

const getAllPosts = async (): Promise<IPost[]> => {
  // const posts = await postsCollection.find({}, { projection: { _id: 0 } }).toArray();
  return await postsCollection.find({}, { projection: { _id: 0 } }).toArray();
};

const getPostById = async (postId: string): Promise<IPost> => {
  // if (!ObjectId.isValid(postId)) {
  //   throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  // }

  // const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
  const post = await postsCollection.findOne({ id: postId }, { projection: { _id: 0 } });

  if (!post) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  return post;
};

const createPost = async (post: ICreatePostBody): Promise<IPost> => {
  // no errors should occur here coz all is checked in the validation middleware for this request
  // const blogName = (await blogsCollection.findOne({ _id: new ObjectId(post.blogId) }))!.name;
  // const blogName = (await blogsCollection.findOne({ id: post.blogId }, { projection: { _id: 0 } }))!.name;

  const blogName = (await BlogsRepository.getBlogById(post.blogId)).name;

  const newPost: IPost = {
    ...post,
    id: uuidv4(),
    createdAt: new Date(),
    blogName,
  };

  await postsCollection.insertOne({ ...newPost }); // Create a copy to avoid mutation
  return { ...newPost }; // Return a copy to ensure no _id is included
};

const updatePost = async (postId: string, newPost: IUpdatePostBody): Promise<void> => {
  // if (!ObjectId.isValid(postId)) {
  //   throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  // }

  const postToUpdate = await postsCollection.findOne({ id: postId }, { projection: { _id: 0 } });

  if (!postToUpdate) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await postsCollection.updateOne({ id: postId }, { $set: newPost });
};

const deletePost = async (postId: string): Promise<void> => {
  // if (!ObjectId.isValid(postId)) {
  //   throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  // }

  const postToDelete = await postsCollection.findOne({ id: postId }, { projection: { _id: 0 } });

  if (!postToDelete) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await postsCollection.deleteOne({ id: postId });
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
