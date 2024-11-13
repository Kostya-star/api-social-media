import { DESCRIPTION_MAX_SYMBOLS, NAME_MAX_SYMBOLS, URL_MAX_SYMBOLS } from '@/const/blogs/blogs';

export enum BlogsErrorsList {
  NOT_FOUND = 'Blog not found',

  NAME_EMPTY = 'Name must not be empty',
  NAME_WRONG_FORMAT = 'Name must be a string',
  NAME_EXCEEDED_LENGTH = `Name must not exceed ${NAME_MAX_SYMBOLS} characters`,
  
  DESCRIPTION_EMPTY = 'Description must not be empty',
  DESCRIPTION_WRONG_FORMAT = 'Description must be a string',
  DESCRIPTION_EXCEEDED_LENGTH = `Description must not exceed ${DESCRIPTION_MAX_SYMBOLS} characters`,
  
  URL_EMPTY = 'Description must not be empty',
  URL_WRONG_FORMAT = 'Website URL must be a string url',
  URL_INVALID = 'Website URL must be a valid URL starting with https://',
  URL_EXCEEDED_LENGTH = `Website URL must not exceed ${URL_MAX_SYMBOLS} characters`,
}
