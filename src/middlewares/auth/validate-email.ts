import { USER_EMAIL_PATTERN } from '@/const/users/users';
import { UsersErrorsList } from '@/errors/users-errors';
import { body } from 'express-validator';

export const validateEmail = () =>
  body('email').isString().withMessage(UsersErrorsList.EMAIL_IS_NOT_STRING).matches(USER_EMAIL_PATTERN).withMessage(UsersErrorsList.EMAIL_INVALID_PATTERN);
