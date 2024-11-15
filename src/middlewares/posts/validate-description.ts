import { DESCRIPTION_MAX_LENGTH } from '@/const/posts/posts';
import { PostsErrorsList } from '@/errors/posts-errors';
import { body } from 'express-validator';

export const validateDescription = () =>
  body('shortDescription')
    .isString()
    .withMessage(PostsErrorsList.SHORT_DESCRIPTION_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(PostsErrorsList.SHORT_DESCRIPTION_EMPTY)
    .isLength({ max: DESCRIPTION_MAX_LENGTH })
    .withMessage(PostsErrorsList.SHORT_DESCRIPTION_EXCEEDED_LENGTH);
