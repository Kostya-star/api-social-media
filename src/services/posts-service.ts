import { mockDB } from '@/mockDB';
import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import { IPost } from '@/types/posts/post';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';

const getAllPosts = (): IPost[] => {
  try {
    return mockDB.posts;
  } catch (err) {
    throw err;
  }
};

const getPostById = (postId: string): IPost => {
  try {
    const post = mockDB.posts.find((p) => p.id === postId);

    if (!post) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    return post;
  } catch (err) {
    throw err;
  }
};

const createPost = (post: ICreatePostBody): IPost => {
  const blogName = mockDB.blogs.find(b => b.id === post.blogId)!.name;

  const newPost: IPost = {
    ...post,
    blogName,
    id: uuidv4(),
  };

  try {
    mockDB.posts.push(newPost);
    return newPost;
  } catch (err) {
    throw err;
  }
};

const updatePost = (postId: string, newPost: IUpdatePostBody): void => {
  const postToUpdate = mockDB.posts.find((p) => p.id === postId);

  if (!postToUpdate) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  try {
    postToUpdate.title = newPost.title;
    postToUpdate.shortDescription = newPost.shortDescription;
    postToUpdate.content = newPost.content;
    postToUpdate.blogId = newPost.blogId;
  } catch (err) {
    throw err;
  }
};

const deletePost = (postId: string): void => {
  const postToDelete = mockDB.posts.find((p) => p.id === postId);

  if (!postToDelete) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  try {
    mockDB.posts = mockDB.posts.filter((p) => p.id !== postId);
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
