import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IErrorItem } from '@/types/error-item';

export const ErrorService = (message: any, status: HTTP_STATUS_CODES): IErrorItem => ({ message, status });
