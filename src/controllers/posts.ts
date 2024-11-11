import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import PostsService from '@/services/posts-service';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';

const getAllPosts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = PostsService.getAllPosts();

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(posts);
  } catch (err) {
    next(err);
  }
};

const getPostById = (req: Request<{ postId: string }>, res: Response, next: NextFunction) => {
  const { postId } = req.params; 
  try {
    const post = PostsService.getPostById(postId);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(post);
  } catch (err) {
    next(err);
  }
};

const createPost = (req: Request<any, any, ICreatePostBody>, res: Response, next: NextFunction) => {
  const newPost = req.body;

  try {
    const post = PostsService.createPost(newPost);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(post);
  } catch (err) {
    next(err);
  }
};

const updatePost = (req: Request<{ postId: string }, any, IUpdatePostBody>, res: Response, next: NextFunction) => {
  const postId = req.params.postId;
  const newPost = req.body;

  try {
    PostsService.updatePost(postId, newPost);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const deletePost = (req: Request<{ postId: string }>, res: Response, next: NextFunction) => {
  const postId = req.params.postId;

  try {
    PostsService.deletePost(postId);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
