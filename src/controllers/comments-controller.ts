import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ObjectId, WithId } from 'mongodb';
import { IComment } from '@/types/comments/comment';
import CommentsRepository from '@/repositories/comments-repository';
import { ErrorService } from '@/services/error-service';
import { CommentsErrorsList } from '@/errors/comments-errors';
import { commentObjMapper } from '@/util/commentObjMapper';
import { ICommentBody } from '@/types/comments/commentBody';
import blogsService from '@/services/blogs-service';
import CommentsService from '@/services/comments-service';

const getCommentById = async (req: Request<{ commentId: ObjectId }>, res: Response<IComment>, next: NextFunction) => {
  console.log('getCommentById');
  try {
    const commentId = req.params.commentId;

    if (!ObjectId.isValid(commentId)) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const comment = await CommentsRepository.getCommentById(commentId);

    if (!comment) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(commentObjMapper(comment));
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req: Request<{ commentId: ObjectId }, any, ICommentBody>, res: Response<void>, next: NextFunction) => {
  const commentId = req.params.commentId;
  const newComment = req.body;

  // the user attached into the request with auth middleware. is used to determine if the comment belongs to the current user
  const currentUserId = req.userId!;

  try {
    await CommentsService.updateComment(commentId, newComment, currentUserId);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req: Request<{ commentId: ObjectId }, any>, res: Response<void>, next: NextFunction) => {
  const commentId = req.params.commentId;

  // the user attached into the request with auth middleware. is used to determine if the comment belongs to the current user
  const currentUserId = req.userId!;

  try {
    await CommentsService.deleteComment(commentId, currentUserId);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  getCommentById,
  updateComment,
  deleteComment,
};
