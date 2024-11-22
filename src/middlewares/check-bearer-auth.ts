import { ErrorService } from '@/services/error-service';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const checkBearerAuth = (req: Request<any>, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer')) {
      return next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));
    }

    const token = authHeader.split(' ')[1];

    if (!token) return next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));
    
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as { userId: ObjectId };
    
    if (!decodedToken.userId) return next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    next(err);
  }
};
