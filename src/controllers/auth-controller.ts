import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import AuthService from '@/services/auth-service';

const login = async (req: Request<any, any, IAuthLoginPayload>, res: Response, next: NextFunction) => {
  try {
    await AuthService.login(req.body);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  login,
};
