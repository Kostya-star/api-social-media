import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';

export interface IErrorItem {
  message?: HTTP_ERROR_MESSAGES | string;
  status?: HTTP_STATUS_CODES;
  stack?: any;
}
