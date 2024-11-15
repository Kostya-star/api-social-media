import { CONTENT_MAX_LENGTH } from '@/const/posts/posts';
import { PostsErrorsList } from '@/errors/posts-errors';
import { body } from 'express-validator';

export const validateContent = () =>
  body('content')
    .isString()
    .withMessage(PostsErrorsList.CONTENT_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(PostsErrorsList.CONTENT_EMPTY)
    .isLength({ max: CONTENT_MAX_LENGTH })
    .withMessage(PostsErrorsList.CONTENT_EXCEEDED_LENGTH);
