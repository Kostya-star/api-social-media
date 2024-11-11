import { CONTENT_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/const/posts/posts';

export enum PostsErrorsList {
  NOT_FOUND = 'Post not found',

  TITLE_EMPTY = 'Title must not be empty',
  TITLE_WRONG_FORMAT = 'Title must be a string',
  TITLE_EXCEEDED_LENGTH = `Title must not exceed ${TITLE_MAX_LENGTH} characters`,

  SHORT_DESCRIPTION_EMPTY = 'Short description must not be empty',
  SHORT_DESCRIPTION_WRONG_FORMAT = 'Short description must be a string',
  SHORT_DESCRIPTION_EXCEEDED_LENGTH = `Short description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`,

  CONTENT_EMPTY = 'Content must not be empty',
  CONTENT_WRONG_FORMAT = 'Content must be a string',
  CONTENT_EXCEEDED_LENGTH = `Content must not exceed ${CONTENT_MAX_LENGTH} characters`,

  BLOG_ID_EMPTY = 'Blog ID must not be empty',
  BLOG_ID_WRONG_FORMAT = 'Blog ID must be a valid string',
  BLOG_NOT_EXIST_WITH_ID = 'Blog with the provided id does not exist',
}
