import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function checkFor400Error<ReqBody>(req: Request<any, any, ReqBody>, res: Response, next: NextFunction) {
  const errors = validationResult(req).array({ onlyFirstError: true }); // Use onlyFirstError to get one error per field
  if (errors.length) {
    const formattedErrors = errors.map((err: any) => ({
      field: err.path,
      message: err.msg,
    }));
    res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({ errorsMessages: formattedErrors });
    return;
  }
  next();
}
