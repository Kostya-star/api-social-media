import { ICreatePostBody } from '@/types/posts/createPostBody';
import { validateTitle } from './validate-title';
import { validateDescription } from './validate-description';
import { validateContent } from './validate-content';
import { checkFor400Error } from '../check-for-400-error';

export const validateCreatePostForBlogFields = [
  validateTitle(),
  validateDescription(),
  validateContent(),
  checkFor400Error<ICreatePostBody>,
];
