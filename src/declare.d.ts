import { ObjectId } from 'mongodb';

declare global {
  namespace Express {
    export interface Request {
      userId?: ObjectId;
      refreshToken?: string;
      cookies: {
        refreshToken?: string;
      };
    }
  }
}