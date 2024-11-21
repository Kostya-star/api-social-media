import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { USER_EMAIL_PATTERN, USER_LOGIN_MAX_LENGTH, USER_LOGIN_MIN_LENGTH, USER_LOGIN_PATTERN, USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@/const/users/users';
import { AuthErrorsList } from '@/errors/auth-errors';
import { UsersErrorsList } from '@/errors/users-errors';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

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

  (req: Request<any, any, ICreateUserBody>, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true }); // Use onlyFirstError to get one error per field
    if (errors.length) {
      const formattedErrors = errors.map((err: any) => ({
        field: err.path,
        message: err.msg,
      }));
      res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({ errorsMessages: formattedErrors });
      return;
    }
    next();
  },
];
