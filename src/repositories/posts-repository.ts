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

const getPostById = async (postId: ObjectId): Promise<IPost | null> => {
  const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
  return post ? postObjMapper(post) : null;
};

const createPost = async (post: IPost): Promise<IPost> => {
  const res = await postsCollection.insertOne(post);
  return postObjMapper({ ...post, _id: res.insertedId });
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
  createPost,
  updatePost,
  deletePost,
};
