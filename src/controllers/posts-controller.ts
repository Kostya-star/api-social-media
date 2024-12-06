import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import PostsService from '@/services/posts-service';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ObjectId } from 'mongodb';
import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/const/query-defaults';
import { IBaseQuery } from '@/types/base-query';
import PostsRepository from '@/repositories/posts/posts-repository-commands';
import { ErrorService } from '@/services/error-service';
import { PostsErrorsList } from '@/errors/posts-errors';
import { IBaseResponse } from '@/types/base-response';
import CommentsService from '@/services/comments-service';
import { IPostDB, IPostView } from '@/types/posts/post';
import { ICommentDB, ICommentView } from '@/types/comments/comment';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import PostsRepositoryQuery from '@/repositories/posts/posts-repository-query';
import CommentsRepositoryQuery from '@/repositories/comments/comments-repository-query';
import { CommentsErrorsList } from '@/errors/comments-errors';

const getAllPosts = async (req: Request<any, any, any, IBaseQuery<IPostDB>>, res: Response<IBaseResponse<IPostView>>, next: NextFunction) => {
  try {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
    const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
    const pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

    const resp = await PostsRepositoryQuery.getAllPosts({ sortBy, sortDirection, pageNumber, pageSize });

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req: Request<{ postId: MongooseObjtId }>, res: Response<IPostView>, next: NextFunction) => {
  const { postId } = req.params;

  try {
    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const post = await PostsRepositoryQuery.getPostById(postId);

    if (!post) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(post);
  } catch (err) {
    next(err);
  }
};

const getCommentsForPosts = async (
  req: Request<{ postId: MongooseObjtId }, any, any, IBaseQuery<ICommentDB>>,
  res: Response<IBaseResponse<ICommentView>>,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;

    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const post = await PostsRepository.getPostById(postId);

    if (!post) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const sortBy = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
    const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
    const pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

    const resp = await CommentsRepositoryQuery.getCommentsForPost(
      { sortBy, sortDirection, pageNumber, pageSize },
      postId
    );

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
  } catch (err) {
    next(err);
  }
};

const createPost = async (req: Request<any, any, ICreatePostBody>, res: Response<IPostView>, next: NextFunction) => {
  const newPost = req.body;

  try {
    const postId = await PostsService.createPost(newPost);
    const post = await PostsRepositoryQuery.getPostById(postId);

    if (!post) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(post);
  } catch (err) {
    next(err);
  }
};

const createCommentForPost = async (req: Request<{ postId: MongooseObjtId }, any, { content: string }>, res: Response<ICommentView>, next: NextFunction) => {
  const newComment = req.body;
  const postId = req.params.postId;
  const userId = req.userId!;

  try {
    const commentId = await CommentsService.createCommentForPost(postId, newComment, userId);
    const comment = await CommentsRepositoryQuery.getCommentById(commentId);

    if (!comment) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(comment);
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req: Request<{ postId: MongooseObjtId }, any, IUpdatePostBody>, res: Response<void>, next: NextFunction) => {
  const postId = req.params.postId;
  const newPost = req.body;

  try {
    await PostsService.updatePost(postId, newPost);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req: Request<{ postId: MongooseObjtId }>, res: Response<void>, next: NextFunction) => {
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
  getCommentsForPosts,
  getPostById,
  createPost,
  createCommentForPost,
  updatePost,
  deletePost,
};
