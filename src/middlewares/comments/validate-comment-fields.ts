import { CommentsErrorsList } from '@/errors/comments-errors';
import { body } from 'express-validator';
import { COMMENT_CONTENT_MAX_LENGTH, COMMENT_CONTENT_MIN_LENGTH } from '@/const/comments/comments';
import { checkFor400Error } from '../check-for-400-error';

export const validateCommentFields = [
  body('content')
    .isString()
    .withMessage(CommentsErrorsList.CONTENT_NOT_STRING)
    .trim()
    .isLength({ max: COMMENT_CONTENT_MAX_LENGTH })
    .withMessage(CommentsErrorsList.CONTENT_TOO_BIG)
    .isLength({ min: COMMENT_CONTENT_MIN_LENGTH })
    .withMessage(CommentsErrorsList.CONTENT_TOO_SHORT),

  checkFor400Error<{ content: string }>,
];
