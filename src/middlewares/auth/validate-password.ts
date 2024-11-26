import { USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@/const/users/users';
import { UsersErrorsList } from '@/errors/users-errors';
import { body } from 'express-validator';

export const validatePassword = () =>
  body('password')
    .isString()
    .withMessage(UsersErrorsList.PASSWORD_IS_NOT_STRING)
    .trim()
    .isLength({ max: USER_PASSWORD_MAX_LENGTH })
    .withMessage(UsersErrorsList.PASSWORD_TOO_BIG)
    .isLength({ min: USER_PASSWORD_MIN_LENGTH })
    .withMessage(UsersErrorsList.PASSWORD_TOO_SHORT);
