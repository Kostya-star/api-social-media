import { TITLE_MAX_LENGTH } from '@/const/posts/posts';
import { PostsErrorsList } from '@/errors/posts-errors';
import { body } from 'express-validator';

export const validateTitle = () =>
  body('title')
    .isString()
    .withMessage(PostsErrorsList.TITLE_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(PostsErrorsList.TITLE_EMPTY)
    .isLength({ max: TITLE_MAX_LENGTH })
    .withMessage(PostsErrorsList.TITLE_EXCEEDED_LENGTH);
