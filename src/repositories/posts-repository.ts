import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { postsCollection } from '@/DB';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ErrorService } from '@/services/error-service';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IPost } from '@/types/posts/post';
import BlogsRepository from './blogs-repository';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ObjectId } from 'mongodb';
import { postObjMapper } from '@/util/postObjMapper';

const getAllPosts = async (): Promise<IPost[]> => {
  const posts = await postsCollection.find({}).toArray();
  return posts.map(postObjMapper);
};

const getPostById = async (postId: ObjectId): Promise<IPost> => {
  if (!ObjectId.isValid(postId)) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

  if (!post) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  return postObjMapper(post)
};

const createPost = async (post: ICreatePostBody): Promise<IPost> => {
  // no errors should occur here coz all is checked in the validation middleware for this request
  const blogName = (await BlogsRepository.getBlogById(post.blogId)).name;

  const newPost: IPost = { ...post, createdAt: new Date(), blogName };

  const res = await postsCollection.insertOne(newPost);
  return postObjMapper({ ...newPost, _id: res.insertedId });
};

const updatePost = async (postId: ObjectId, newPost: IUpdatePostBody): Promise<void> => {
  if (!ObjectId.isValid(postId)) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const postToUpdate = await postsCollection.findOne({ _id: new ObjectId(postId) });

  if (!postToUpdate) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await postsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: newPost });
};

const deletePost = async (postId: ObjectId): Promise<void> => {
  if (!ObjectId.isValid(postId)) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const postToDelete = await postsCollection.findOne({ _id: new ObjectId(postId) });

  if (!postToDelete) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await postsCollection.deleteOne({ _id: new ObjectId(postId) });
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
