import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IPost } from '@/types/posts/post';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { blogsCollection, postsCollection } from '@/DB';
import { ObjectId } from 'mongodb';

const getAllPosts = async (): Promise<IPost[]> => {
  try {
    const posts = await postsCollection.find({}).toArray();
    return posts;
  } catch (err) {
    throw err;
  }
};

const getPostById = async (postId: ObjectId): Promise<IPost> => {
  try {
    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    return post;
  } catch (err) {
    throw err;
  }
};

const createPost = async (post: ICreatePostBody): Promise<IPost> => {
  // no errors should occur here coz all is checked in the validation middleware for this request
  const blogName = (await blogsCollection.findOne({ _id: new ObjectId(post.blogId) }))!.name;

  const newPost: IPost = {
    ...post,
    blogName,
  };

  try {
    const res = await postsCollection.insertOne(newPost);
    return { ...newPost, _id: res.insertedId };
  } catch (err) {
    throw err;
  }
};

const updatePost = async (postId: ObjectId, newPost: IUpdatePostBody): Promise<void> => {
  try {
    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const postToUpdate = await postsCollection.findOne({ _id: new ObjectId(postId) });

    if (!postToUpdate) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await postsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: newPost });
  } catch (err) {
    throw err;
  }
};

const deletePost = async (postId: ObjectId): Promise<void> => {
  try {
    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const postToDelete = await postsCollection.findOne({ _id: new ObjectId(postId) });

    if (!postToDelete) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await postsCollection.deleteOne({ _id: new ObjectId(postId) });
  } catch (err) {
    throw err;
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
