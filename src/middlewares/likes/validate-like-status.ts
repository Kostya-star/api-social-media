import { body } from 'express-validator';
import { checkFor400Error } from '../check-for-400-error';
import { LikeStatus } from '@/const/likes/like-status';
import { LikesErrorsList } from '@/errors/likes-errors';

export const validateLikeStatus = [
  body('likeStatus').isString().trim().isIn(Object.values(LikeStatus)).withMessage(LikesErrorsList.INVALID_LIKE_STATUS),
  checkFor400Error<LikeStatus[]>,
];
