import { USER_LOGIN_MAX_LENGTH, USER_LOGIN_MIN_LENGTH, USER_LOGIN_PATTERN } from '@/const/users/users';
import { UsersErrorsList } from '@/errors/users-errors';
import { body } from 'express-validator';

export const validateLogin = () =>
  body('login')
    .isString()
    .withMessage(UsersErrorsList.LOGIN_IS_NOT_STRING)
    .trim()
    .isLength({ max: USER_LOGIN_MAX_LENGTH })
    .withMessage(UsersErrorsList.LOGIN_TOO_BIG)
    .isLength({ min: USER_LOGIN_MIN_LENGTH })
    .withMessage(UsersErrorsList.LOGIN_TOO_SHORT)
    .matches(USER_LOGIN_PATTERN)
    .withMessage(UsersErrorsList.LOGIN_INVALID_PATTERN);
