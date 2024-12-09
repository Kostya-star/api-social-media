import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ObjectId } from 'mongodb';
import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/const/query-defaults';
import { IBaseQuery } from '@/types/base-query';
import { ErrorService } from '@/services/error-service';
import { PostsErrorsList } from '@/errors/posts-errors';
import { IBaseResponse } from '@/types/base-response';
import { IPostDB, IPostView } from '@/types/posts/post';
import { ICommentDB, ICommentView } from '@/types/comments/comment';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { CommentsErrorsList } from '@/errors/comments-errors';
import { PostsService } from '@/services/posts-service';
import { CommentsService } from '@/services/comments-service';
import { PostsRepositoryQuery } from '@/repositories/posts/posts-repository-query';
import { CommentsRepositoryQuery } from '@/repositories/comments/comments-repository-query';
import { LikeStatus } from '@/const/likes/like-status';
import { LikesService } from '@/services/likes-service';

export class PostsController {
  protected postsService;
  protected commentsService;
  protected postsRepositoryQuery;
  protected commentsRepositoryQuery;
  protected likesService;

  constructor(
    postsService: PostsService,
    commentsService: CommentsService,
    postsRepositoryQuery: PostsRepositoryQuery,
    commentsRepositoryQuery: CommentsRepositoryQuery,
    likesService: LikesService
  ) {
    this.postsService = postsService;
    this.commentsService = commentsService;
    this.postsRepositoryQuery = postsRepositoryQuery;
    this.commentsRepositoryQuery = commentsRepositoryQuery;
    this.likesService = likesService;
  }

  async getAllPosts(req: Request<any, any, any, IBaseQuery<IPostDB>>, res: Response<IBaseResponse<IPostView>>, next: NextFunction) {
    try {
      const sortBy = req.query.sortBy || 'createdAt';
      const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
      const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
      const pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;
      
      const userId = req.userId;

      const resp = await this.postsRepositoryQuery.getAllPosts({ sortBy, sortDirection, pageNumber, pageSize }, userId);

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
    } catch (err) {
      next(err);
    }
  }

  async getPostById(req: Request<{ postId: MongooseObjtId }>, res: Response<IPostView>, next: NextFunction) {
    const { postId } = req.params;
    const userId = req.userId;

    try {
      if (!ObjectId.isValid(postId)) {
        throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const post = await this.postsRepositoryQuery.getPostById(postId, userId);

      if (!post) {
        throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(post);
    } catch (err) {
      next(err);
    }
  }

  async getCommentsForPost(
    req: Request<{ postId: MongooseObjtId }, any, any, IBaseQuery<ICommentDB>>,
    res: Response<IBaseResponse<ICommentView>>,
    next: NextFunction
  ) {
    try {
      const postId = req.params.postId;
      const userId = req.userId;

      if (!ObjectId.isValid(postId)) {
        throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const post = await this.postsRepositoryQuery.getPostById(postId);

      if (!post) {
        throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const sortBy = req.query.sortBy || 'createdAt';
      const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
      const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
      const pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

      const resp = await this.commentsRepositoryQuery.getCommentsForPost({ sortBy, sortDirection, pageNumber, pageSize }, postId, userId);

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
    } catch (err) {
      next(err);
    }
  }

  async createPost(req: Request<any, any, ICreatePostBody>, res: Response<IPostView>, next: NextFunction) {
    const newPost = req.body;

    try {
      const postId = await this.postsService.createPost(newPost);
      const post = await this.postsRepositoryQuery.getPostById(postId);

      if (!post) {
        throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUS_CODES.SUCCESS_201).json(post);
    } catch (err) {
      next(err);
    }
  }

  async createCommentForPost(req: Request<{ postId: MongooseObjtId }, any, { content: string }>, res: Response<ICommentView>, next: NextFunction) {
    const newComment = req.body;
    const postId = req.params.postId;
    const userId = req.userId!;

    try {
      const commentId = await this.commentsService.createCommentForPost(postId, newComment, userId);
      const comment = await this.commentsRepositoryQuery.getCommentById(commentId);

      if (!comment) {
        throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUS_CODES.SUCCESS_201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req: Request<{ postId: MongooseObjtId }, any, IUpdatePostBody>, res: Response<void>, next: NextFunction) {
    const postId = req.params.postId;
    const newPost = req.body;

    try {
      await this.postsService.updatePost(postId, newPost);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req: Request<{ postId: MongooseObjtId }>, res: Response<void>, next: NextFunction) {
    const postId = req.params.postId;

    try {
      await this.postsService.deletePost(postId);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }

  async handlePostLike(req: Request<{ postId: MongooseObjtId }, any, { likeStatus: LikeStatus }>, res: Response<void>, next: NextFunction) {
    const postId = req.params.postId;
    const currentUserId = req.userId!;
    const likeStatus = req.body.likeStatus;

    try {
      await this.likesService.handleLike(postId, likeStatus, currentUserId, 'isPost');

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }

}
