import { body } from 'express-validator';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { ObjectId } from 'mongodb';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { validateContent } from './validate-content';
import { validateDescription } from './validate-description';
import { validateTitle } from './validate-title';
import { checkFor400Error } from '../check-for-400-error';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { blogsRepositoryQuery } from '@/composition-root';

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
    .custom(async (blogId: MongooseObjtId) => {
      if (!ObjectId.isValid(blogId)) {
        throw new Error(BlogsErrorsList.NOT_FOUND);
      }

      const blog = await blogsRepositoryQuery.getBlogById(blogId);

      if (!blog) {
        throw new Error(BlogsErrorsList.NOT_FOUND);
      }
      return true;
    }),

  checkFor400Error<ICreatePostBody>,
];
