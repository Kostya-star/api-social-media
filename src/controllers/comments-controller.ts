import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ObjectId } from 'mongodb';
import CommentsRepository from '@/repositories/comments-repository';
import { ErrorService } from '@/services/error-service';
import { CommentsErrorsList } from '@/errors/comments-errors';
import { commentObjMapper } from '@/util/mappers/commentObjMapper';
import CommentsService from '@/services/comments-service';
import { ICommentView } from '@/types/comments/comment';
import { MongooseObjtId } from '@/types/mongoose-object-id';

const getCommentById = async (req: Request<{ commentId: MongooseObjtId }>, res: Response<ICommentView>, next: NextFunction) => {
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

const updateComment = async (req: Request<{ commentId: MongooseObjtId }, any, { content: string }>, res: Response<void>, next: NextFunction) => {
  const commentId = req.params.commentId;
  const newComment = req.body;

  const currentUserId = req.userId!;

  try {
    await CommentsService.updateComment(commentId, newComment, currentUserId);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req: Request<{ commentId: MongooseObjtId }, any>, res: Response<void>, next: NextFunction) => {
  const commentId = req.params.commentId;
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
