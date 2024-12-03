import { ErrorService } from '@/services/error-service';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

type MObjectId = Types.ObjectId;

export const checkBearerAuth = (req: Request<any>, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer')) {
      throw Error;
    }

    const token = authHeader.split(' ')[1];

    if (!token) throw Error;

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: MObjectId };

    if (!decodedToken.userId) throw Error;

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));
  }
};
