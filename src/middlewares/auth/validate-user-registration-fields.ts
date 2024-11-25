import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { USER_EMAIL_PATTERN, USER_LOGIN_MAX_LENGTH, USER_LOGIN_MIN_LENGTH, USER_LOGIN_PATTERN, USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@/const/users/users';
import { UsersErrorsList } from '@/errors/users-errors';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUserRegistrationFields = [
  body('login')
    .isString()
    .withMessage(UsersErrorsList.LOGIN_IS_NOT_STRING)
    .trim()
    .isLength({ max: USER_LOGIN_MAX_LENGTH })
    .withMessage(UsersErrorsList.LOGIN_TOO_BIG)
    .isLength({ min: USER_LOGIN_MIN_LENGTH })
    .withMessage(UsersErrorsList.LOGIN_TOO_SHORT)
    .matches(USER_LOGIN_PATTERN)
    .withMessage(UsersErrorsList.LOGIN_INVALID_PATTERN),
    body('password')
    .isString()
    .withMessage(UsersErrorsList.PASSWORD_IS_NOT_STRING)
    .trim()
    .isLength({ max: USER_PASSWORD_MAX_LENGTH })
    .withMessage(UsersErrorsList.PASSWORD_TOO_BIG)
    .isLength({ min: USER_PASSWORD_MIN_LENGTH })
    .withMessage(UsersErrorsList.PASSWORD_TOO_SHORT),
    body('email')
    .isString()
    .withMessage(UsersErrorsList.EMAIL_IS_NOT_STRING)
    .matches(USER_EMAIL_PATTERN)
    .withMessage(UsersErrorsList.EMAIL_INVALID_PATTERN),

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
