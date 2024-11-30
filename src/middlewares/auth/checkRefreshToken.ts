import { ErrorService } from '@/services/error-service';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IRefreshTokenDecodedPayload } from '@/types/refresh-token-decoded-payload';

export const checkRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw Error;
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as IRefreshTokenDecodedPayload;

    if (!decoded.userId || !decoded.sessionId || !decoded.iat || !decoded.exp) throw Error;

    req.refresh_token_decoded_payload = {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch (err) {
    next(ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401));
  }
};
