import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import PostsService from '@/services/posts-service';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ObjectId } from 'mongodb';

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await PostsService.getAllPosts();

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(posts);
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req: Request<{ postId: ObjectId }>, res: Response, next: NextFunction) => {
  const { postId } = req.params;

  try {
    const post = await PostsService.getPostById(postId);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(post);
  } catch (err) {
    next(err);
  }
};

const createPost = async (req: Request<any, any, ICreatePostBody>, res: Response, next: NextFunction) => {
  const newPost = req.body;

  try {
    const post = await PostsService.createPost(newPost);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(post);
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req: Request<{ postId: ObjectId }, any, IUpdatePostBody>, res: Response, next: NextFunction) => {
  const postId = req.params.postId;
  const newPost = req.body;

  try {
    await PostsService.updatePost(postId, newPost);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req: Request<{ postId: ObjectId }>, res: Response, next: NextFunction) => {
  const postId = req.params.postId;

  try {
    await PostsService.deletePost(postId);

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
  deletePost,
};
