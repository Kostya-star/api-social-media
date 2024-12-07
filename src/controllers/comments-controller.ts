import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ObjectId } from 'mongodb';
import { ErrorService } from '@/services/error-service';
import { CommentsErrorsList } from '@/errors/comments-errors';
import { ICommentView } from '@/types/comments/comment';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import CommentsRepositoryQuery from '@/repositories/comments/comments-repository-query';
import { LikeStatus } from '@/const/likes/like-status';
import { CommentsService } from '@/services/comments-service';
import { LikesService } from '@/services/likes-service';

export class CommentsController {
  protected commentsService;
  protected likesService;

  constructor(commentsService: CommentsService, likesService: LikesService) {
    this.commentsService = commentsService;
    this.likesService = likesService;
  }

  async getCommentById(req: Request<{ commentId: MongooseObjtId }>, res: Response<ICommentView>, next: NextFunction) {
    try {
      const commentId = req.params.commentId;
      const userId = req.userId;

      if (!ObjectId.isValid(commentId)) {
        throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const comment = await CommentsRepositoryQuery.getCommentById(commentId, userId);

      if (!comment) {
        throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(comment);
    } catch (err) {
      next(err);
    }
  }

  async updateComment(req: Request<{ commentId: MongooseObjtId }, any, { content: string }>, res: Response<void>, next: NextFunction) {
    const commentId = req.params.commentId;
    const newComment = req.body;

    const currentUserId = req.userId!;

    try {
      await this.commentsService.updateComment(commentId, newComment, currentUserId);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req: Request<{ commentId: MongooseObjtId }, any>, res: Response<void>, next: NextFunction) {
    const commentId = req.params.commentId;
    const currentUserId = req.userId!;

    try {
      await this.commentsService.deleteComment(commentId, currentUserId);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }

  async handleCommentLike(req: Request<{ commentId: MongooseObjtId }, any, { likeStatus: LikeStatus }>, res: Response<void>, next: NextFunction) {
    const commentId = req.params.commentId;
    const currentUserId = req.userId!;
    const likeStatus = req.body.likeStatus;

    try {
      await this.likesService.handleLike(commentId, likeStatus, currentUserId, 'isComment');

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }
}
