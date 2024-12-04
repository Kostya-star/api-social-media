import {
  USER_EMAIL_PATTERN,
  USER_LOGIN_MAX_LENGTH,
  USER_LOGIN_MIN_LENGTH,
  USER_LOGIN_PATTERN,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '@/const/users/users';
import { AuthErrorsList } from '@/errors/auth-errors';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { body } from 'express-validator';
import { checkFor400Error } from '../check-for-400-error';

export const validateAuthLoginFields = [
  body('loginOrEmail')
    .isString()
    .withMessage(AuthErrorsList.LOGIN_OR_EMAIL_WRONG)
    .trim()
    .custom((input: string) => {
      const isLogin = USER_LOGIN_PATTERN.test(input);
      const isEmail = USER_EMAIL_PATTERN.test(input);

      if (!isLogin && !isEmail) throw new Error(AuthErrorsList.LOGIN_OR_EMAIL_WRONG);

      if (isLogin) {
        if (input.length < USER_LOGIN_MIN_LENGTH) throw new Error(AuthErrorsList.LOGIN_OR_EMAIL_WRONG);
        if (input.length > USER_LOGIN_MAX_LENGTH) throw new Error(AuthErrorsList.LOGIN_OR_EMAIL_WRONG);
      }

      return true;
    }),
  body('password')
    .isString()
    .withMessage(AuthErrorsList.PASSWORD_WRONG)
    .trim()
    .isLength({ max: USER_PASSWORD_MAX_LENGTH })
    .withMessage(AuthErrorsList.PASSWORD_WRONG)
    .isLength({ min: USER_PASSWORD_MIN_LENGTH })
    .withMessage(AuthErrorsList.PASSWORD_WRONG),

  checkFor400Error<ICreateUserBody>,
];