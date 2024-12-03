import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { ObjectId } from 'mongodb';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { validateContent } from './validate-content';
import { validateDescription } from './validate-description';
import { validateTitle } from './validate-title';
import { Types } from 'mongoose';
import BlogsRepository from '@/repositories/blogs-repository';

type MObjectId = Types.ObjectId;

export const validateCreatePostFields = [
  validateTitle(),
  validateDescription(),
  validateContent(),

  body('blogId')
    .isString()
    .withMessage(PostsErrorsList.BLOG_ID_WRONG_FORMAT)
    .trim()
    .notEmpty()
    .withMessage(PostsErrorsList.BLOG_ID_EMPTY)

    // check if a blog with id of 'blogId' exists
    .custom(async (blogId: MObjectId) => {
      if (!ObjectId.isValid(blogId)) {
        throw new Error(BlogsErrorsList.NOT_FOUND);
      }

      const blog = await BlogsRepository.getBlogById(blogId)

      if (!blog) {
        throw new Error(BlogsErrorsList.NOT_FOUND);
      }
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
