import { HTTP_ERROR_MESSAGES } from '@/settings/http-error-messages';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';

export interface IErrorItem {
  message?: HTTP_ERROR_MESSAGES | string;
  status?: HTTP_STATUS_CODES;
  stack?: any;
}
