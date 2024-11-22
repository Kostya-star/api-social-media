import { ErrorService } from '@/services/error-service';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { NextFunction, Request, Response } from 'express';

export const checkBasicAuth = (req: Request<any>, res: Response, next: NextFunction) => {
  try {
    const authVal = req.headers.authorization; // encoded 'Basic base64(admin:qwerty)'

    if (!authVal || typeof authVal !== 'string' || !authVal.startsWith('Basic')) {
      return next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));
    }

    const base64 = authVal.split(' ')[1] ?? ''; // base64(admin:qwerty)
    const credentials = Buffer.from(base64, 'base64').toString('ascii'); // admin:qwerty
    const isAuth = process.env.AUTH_BASIC_CREDENTIALS === credentials;

    if (!isAuth) {
      return next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));
    }

    next();
  } catch (err) {
    next(err);
  }
};
