import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { DESCRIPTION_MAX_SYMBOLS, WEBSITE_URL_REGEX, NAME_MAX_SYMBOLS, URL_MAX_SYMBOLS } from '@/const/blogs/blogs';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';

export const validateBlogFields = [
  body('name')
    .isString()
    .withMessage(BlogsErrorsList.NAME_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(BlogsErrorsList.NAME_EMPTY)
    .isLength({ max: NAME_MAX_SYMBOLS })
    .withMessage(BlogsErrorsList.NAME_EXCEEDED_LENGTH),

  body('description')
    .isString()
    .withMessage(BlogsErrorsList.DESCRIPTION_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(BlogsErrorsList.DESCRIPTION_EMPTY)
    .isLength({ max: DESCRIPTION_MAX_SYMBOLS })
    .withMessage(BlogsErrorsList.DESCRIPTION_EXCEEDED_LENGTH),

  body('websiteUrl')
    .isString()
    .withMessage(BlogsErrorsList.URL_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(BlogsErrorsList.URL_EMPTY)
    .matches(WEBSITE_URL_REGEX)
    .withMessage(BlogsErrorsList.URL_INVALID)
    .isLength({ max: URL_MAX_SYMBOLS })
    .withMessage(BlogsErrorsList.URL_EXCEEDED_LENGTH),

  (req: Request<any, any, ICreateBlogPayload>, res: Response, next: NextFunction) => {
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
