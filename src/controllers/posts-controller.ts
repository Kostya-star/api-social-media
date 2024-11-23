import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import PostsService from '@/services/posts-service';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ObjectId } from 'mongodb';
import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/const/query-defaults';
import { IBaseQuery } from '@/types/base-query';
import { IPost } from '@/types/posts/post';
import PostsRepository from '@/repositories/posts-repository';
import { ErrorService } from '@/services/error-service';
import { PostsErrorsList } from '@/errors/posts-errors';
import { postObjMapper } from '@/util/postObjMapper';
import { IBaseResponse } from '@/types/base-response';
import { ICommentBody } from '@/types/comments/commentBody';
import { IComment } from '@/types/comments/comment';
import CommentsService from '@/services/comments-service';
import { commentObjMapper } from '@/util/commentObjMapper';

const getAllPosts = async (req: Request<{ blogId: ObjectId }, any, any, IBaseQuery<IPost>>, res: Response<IBaseResponse<IPost>>, next: NextFunction) => {
  try {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
    const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
    const _pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

    const { pagesCount, page, pageSize, totalCount, items } = await PostsRepository.getAllPosts({ sortBy, sortDirection, pageNumber, pageSize: _pageSize });

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ pagesCount, page, pageSize, totalCount, items: items.map(postObjMapper) });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req: Request<{ postId: ObjectId }>, res: Response<IPost>, next: NextFunction) => {
  const { postId } = req.params;

  try {
    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const post = await PostsRepository.getPostById(postId);

    if (!post) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(postObjMapper(post));
  } catch (err) {
    next(err);
  }
};

const createPost = async (req: Request<any, any, ICreatePostBody>, res: Response<IPost>, next: NextFunction) => {
  const newPost = req.body;

  try {
    const post = await PostsService.createPost(newPost);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(postObjMapper(post));
  } catch (err) {
    next(err);
  }
};

const createCommentForPost = async (req: Request<{ postId: ObjectId }, any, ICommentBody>, res: Response<IComment>, next: NextFunction) => {
  const newComment = req.body;
  const postId = req.params.postId;
  const userId = req.userId!;

  try {
    const comment = await CommentsService.createCommentForPost(postId, newComment, userId);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(commentObjMapper(comment));
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req: Request<{ postId: ObjectId }, any, IUpdatePostBody>, res: Response<void>, next: NextFunction) => {
  const postId = req.params.postId;
  const newPost = req.body;

  try {
    await PostsService.updatePost(postId, newPost);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req: Request<{ postId: ObjectId }>, res: Response<void>, next: NextFunction) => {
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
  createCommentForPost,
  updatePost,
  deletePost,
};
