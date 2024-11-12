import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import { PostsErrorsList } from '@/errors/posts-errors';
import { TITLE_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, CONTENT_MAX_LENGTH } from '@/const/posts/posts';
import { ICreatePostBody } from '@/types/posts/createPostBody';
// import { mockDB } from '@/DB';

export const validatePostFields = [
  body('title')
    .isString()
    .withMessage(PostsErrorsList.TITLE_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(PostsErrorsList.TITLE_EMPTY)
    .isLength({ max: TITLE_MAX_LENGTH })
    .withMessage(PostsErrorsList.TITLE_EXCEEDED_LENGTH),

  body('shortDescription')
    .isString()
    .withMessage(PostsErrorsList.SHORT_DESCRIPTION_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(PostsErrorsList.SHORT_DESCRIPTION_EMPTY)
    .isLength({ max: DESCRIPTION_MAX_LENGTH })
    .withMessage(PostsErrorsList.SHORT_DESCRIPTION_EXCEEDED_LENGTH),

  body('content')
    .isString()
    .withMessage(PostsErrorsList.CONTENT_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(PostsErrorsList.CONTENT_EMPTY)
    .isLength({ max: CONTENT_MAX_LENGTH })
    .withMessage(PostsErrorsList.CONTENT_EXCEEDED_LENGTH),

  body('blogId')
    .isString()
    .withMessage(PostsErrorsList.BLOG_ID_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(PostsErrorsList.BLOG_ID_EMPTY)

    // check if a blog with id of 'blogId' exists
    .custom((blogId) => {
      // const blog = mockDB.blogs.find((b) => b.id === blogId);
      // if (!blog) {
      //   throw new Error(PostsErrorsList.BLOG_NOT_EXIST_WITH_ID);
      // }
      return true;
    }),

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
