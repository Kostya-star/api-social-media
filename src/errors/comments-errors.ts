import { COMMENT_CONTENT_MAX_LENGTH, COMMENT_CONTENT_MIN_LENGTH } from '@/const/comments/comments';

export enum CommentsErrorsList {
  NOT_FOUND = 'Comment not found',

  CONTENT_NOT_STRING = 'Content must be a string',
  CONTENT_TOO_BIG = `Content must not exceed ${COMMENT_CONTENT_MAX_LENGTH} characters`,
  CONTENT_TOO_SHORT = `Content must be at least ${COMMENT_CONTENT_MIN_LENGTH} characters`,

  


  // TITLE_EMPTY = 'Title must not be empty',
  // TITLE_EXCEEDED_LENGTH = `Title must not exceed ${TITLE_MAX_LENGTH} characters`,

  // SHORT_DESCRIPTION_EMPTY = 'Short description must not be empty',
  // SHORT_DESCRIPTION_WRONG_FORMAT = 'Short description must be a string',
  // SHORT_DESCRIPTION_EXCEEDED_LENGTH = `Short description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`,

  // CONTENT_EMPTY = 'Content must not be empty',
  // CONTENT_WRONG_FORMAT = 'Content must be a string',
  // CONTENT_EXCEEDED_LENGTH = `Content must not exceed ${CONTENT_MAX_LENGTH} characters`,

  // BLOG_ID_EMPTY = 'Blog ID must not be empty',
  // BLOG_ID_WRONG_FORMAT = 'Blog ID must be a valid string',
}
