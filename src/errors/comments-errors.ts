import { COMMENT_CONTENT_MAX_LENGTH, COMMENT_CONTENT_MIN_LENGTH } from '@/const/comments/comments';

export enum CommentsErrorsList {
  NOT_FOUND = 'Comment not found',

  CONTENT_NOT_STRING = 'Content must be a string',
  CONTENT_TOO_BIG = `Content must not exceed ${COMMENT_CONTENT_MAX_LENGTH} characters`,
  CONTENT_TOO_SHORT = `Content must be at least ${COMMENT_CONTENT_MIN_LENGTH} characters`,
}
