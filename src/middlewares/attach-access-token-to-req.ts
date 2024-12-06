import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { MongooseObjtId } from '@/types/mongoose-object-id';

export const attachAccessTokenToReq = (req: Request<any>, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) return next();

    const decodedToken = jwt.decode(token) as { userId: MongooseObjtId };

    if (!decodedToken?.userId) return next();

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    next(err);
  }
};