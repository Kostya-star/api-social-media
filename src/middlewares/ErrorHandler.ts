import { HTTP_ERROR_MESSAGES } from '@/settings/http-error-messages';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import { IErrorItem } from '@/types/error-item';
import { NextFunction, Request, Response } from 'express';

export const ErrorHandler = (err: IErrorItem | any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status ?? HTTP_STATUS_CODES.SERVER_ERROR_500;
  const message = err.message || HTTP_ERROR_MESSAGES.SERVER_ERROR_500;

  console.error(err);

  res.status(statusCode).json({
    error: statusCode,
    message: message,
  });
};
