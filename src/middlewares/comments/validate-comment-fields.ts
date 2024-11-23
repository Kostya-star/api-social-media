import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { CommentsErrorsList } from '@/errors/comments-errors';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { COMMENT_CONTENT_MAX_LENGTH, COMMENT_CONTENT_MIN_LENGTH } from '@/const/comments/comments';
import { ICommentBody } from '@/types/comments/commentBody';

export const validateCommentFields = [
  body('content')
    .isString()
    .withMessage(CommentsErrorsList.CONTENT_NOT_STRING)
    .trim()
    .isLength({ max: COMMENT_CONTENT_MAX_LENGTH })
    .withMessage(CommentsErrorsList.CONTENT_TOO_BIG)
    .isLength({ min: COMMENT_CONTENT_MIN_LENGTH })
    .withMessage(CommentsErrorsList.CONTENT_TOO_SHORT),

  (req: Request<any, any, ICommentBody>, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true }); // Use onlyFirstError to get one error per field
    if (errors.length) {
      const formattedErrors = errors.map((err: any) => ({
        field: err.path,
        message: err.msg,
      }));
      res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({ errorsMessages: formattedErrors });
      return;
    }
    next();
  },
];
