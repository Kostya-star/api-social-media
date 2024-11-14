import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IPost } from '@/types/posts/post';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { blogsCollection, postsCollection } from '@/DB';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const getAllPosts = async (): Promise<IPost[]> => {
  try {
    // const posts = await postsCollection.find({}, { projection: { _id: 0 } }).toArray();
    const posts = await postsCollection.find({}, { projection: { _id: 0 } }).toArray();
    return posts;
  } catch (err) {
    throw err;
  }
};

const getPostById = async (postId: string): Promise<IPost> => {
  try {
    // if (!ObjectId.isValid(postId)) {
    //   throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    // }

    // const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    const post = await postsCollection.findOne({ id: postId }, { projection: { _id: 0 } });

    if (!post) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    return post;
  } catch (err) {
    throw err;
  }
};

const createPost = async (post: ICreatePostBody): Promise<IPost> => {
  try {
  // no errors should occur here coz all is checked in the validation middleware for this request
  // const blogName = (await blogsCollection.findOne({ _id: new ObjectId(post.blogId) }))!.name;
  const blogName = (await blogsCollection.findOne({ id: post.blogId }, { projection: { _id: 0 } }))!.name;

  const newPost: IPost = {
    ...post,
    id: uuidv4(),
    createdAt: new Date(),
    blogName,
  };

    await postsCollection.insertOne({...newPost}); // Create a copy to avoid mutation
    return {...newPost}; // Return a copy to ensure no _id is included
  } catch (err) {
    throw err;
  }
};

const updatePost = async (postId: string, newPost: IUpdatePostBody): Promise<void> => {
  try {
    // if (!ObjectId.isValid(postId)) {
    //   throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    // }

    const postToUpdate = await postsCollection.findOne({ id: postId }, { projection: { _id: 0 } });

    if (!postToUpdate) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await postsCollection.updateOne({ id: postId }, { $set: newPost });
  } catch (err) {
    throw err;
  }
};

const deletePost = async (postId: string): Promise<void> => {
  try {
    // if (!ObjectId.isValid(postId)) {
    //   throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    // }

    const postToDelete = await postsCollection.findOne({ id: postId }, { projection: { _id: 0 } });

    if (!postToDelete) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await postsCollection.deleteOne({ id: postId });
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
