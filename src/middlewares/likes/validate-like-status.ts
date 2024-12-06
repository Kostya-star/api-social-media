import { LikeStatus } from '@/const/likes/like-status';
import { LikesErrorsList } from '@/errors/likes-errors';
import { body } from 'express-validator';
import { checkFor400Error } from '../check-for-400-error';

export const validateLikeStatus = [body('likeStatus').isString().trim().isIn(Object.values(LikeStatus)).withMessage(LikesErrorsList.INVALID_LIKE_STATUS), checkFor400Error<LikeStatus[]>];
