import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { validateTitle } from './validate-title';
import { validateDescription } from './validate-description';
import { validateContent } from './validate-content';

export const validateCreatePostForBlogFields = [
  validateTitle(),
  validateDescription(),
  validateContent(),
  (req: Request<any, any, ICreatePostBody>, res: Response, next: NextFunction) => {
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
