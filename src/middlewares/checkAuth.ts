import { ErrorService } from '@/services/error-service';
import { HTTP_ERROR_MESSAGES } from '@/settings/http-error-messages';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import { NextFunction, Request, Response } from 'express';

export const checkAuth = (req: Request<any>, res: Response, next: NextFunction) => {
  try {
    const authVal = req.headers.authorization; // encoded 'Basic base64(admin:qwerty)'
    const base64 = authVal?.split(' ')[1] ?? ''; // base64(admin:qwerty)
    const credentials = Buffer.from(base64, 'base64').toString('ascii'); // admin:qwerty
    const isAuth = process.env.AUTH_CREDENTIALS === credentials;

    if (!isAuth) {
      return next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));
    }

    next();
  } catch (err) {
    next(err);
  }
};
