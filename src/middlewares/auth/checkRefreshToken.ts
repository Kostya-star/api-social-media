import { ErrorService } from '@/services/error-service';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const checkRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken= req.cookies.refreshToken

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw Error;
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: ObjectId };

    if (!decodedToken.userId) throw Error;

    req.userId = decodedToken.userId;
    req.refreshToken = refreshToken;

    next();
  } catch (err) {
    next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));
  }
};
