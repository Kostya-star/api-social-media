import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import { ObjectId } from 'mongodb';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { IUserView } from '@/types/users/user';
import { IChangeUserPasswordPayload } from '@/types/auth/auth-change-password-payload';
import { AuthService } from '@/services/auth-service';
import { UsersRepositoryQuery } from '@/repositories/users/users-repository-query';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/composition-root-types';

@injectable()
export class AuthController {
  protected authService;
  protected usersRepositoryQuery;

  constructor(@inject(TYPES.authService) authService: AuthService, @inject(TYPES.usersRepositoryQuery) usersRepositoryQuery: UsersRepositoryQuery) {
    this.authService = authService;
    this.usersRepositoryQuery = usersRepositoryQuery;
  }

  // user registers themselves without admin
  async selfRegistration(req: Request<any, any, ICreateUserBody>, res: Response, next: NextFunction) {
    try {
      const newUser = req.body;

      await this.authService.selfRegistration(newUser);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err: any) {
      if (err.field) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
          errorsMessages: [
            {
              field: err.field,
              message: err.message,
            },
          ],
        });
        return;
      }

      next(err);
    }
  }

  async registrationConfirmation(req: Request<any, any, { code: string }>, res: Response, next: NextFunction) {
    try {
      const code = req.body.code;

      await this.authService.confirmRegistration(code);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err: any) {
      if (err.field) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
          errorsMessages: [
            {
              field: err.field,
              message: err.message,
            },
          ],
        });
        return;
      }

      next(err);
    }
  }

  async registrationEmailCodeResending(req: Request<any, any, { email: string }>, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;

      await this.authService.resendCode(email);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err: any) {
      if (err.field) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
          errorsMessages: [
            {
              field: err.field,
              message: err.message,
            },
          ],
        });
        return;
      }

      next(err);
    }
  }

  async login(req: Request<any, any, IAuthLoginPayload>, res: Response<{ accessToken: string }>, next: NextFunction) {
    try {
      const userAgent = req.headers['user-agent'] || 'Unknown device';
      const ipAddress = req.ip;

      const { accessToken, refreshToken } = await this.authService.login(req.body, userAgent, ipAddress!);

      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
      res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response<{ accessToken: string }>, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await this.authService.refreshToken(req.refresh_token_decoded_payload);

      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
      res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  }

  async recoverPassword(req: Request<any, any, { email: string }>, res: Response<void>, next: NextFunction) {
    try {
      await this.authService.recoverPassword(req.body.email);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: Request<any, any, IChangeUserPasswordPayload>, res: Response, next: NextFunction) {
    try {
      await this.authService.changePassword(req.body);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err: any) {
      if (err.field) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
          errorsMessages: [
            {
              field: err.field,
              message: err.message,
            },
          ],
        });
        return;
      }

      next(err);
    }
  }

  async getMe(req: Request, res: Response<{ email: string; login: string; userId: ObjectId }>, next: NextFunction) {
    try {
      const userId = req.userId!;

      const { email, login, id } = (await this.usersRepositoryQuery.getUserById(userId)) as IUserView;

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ email, login, userId: id });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response<void>, next: NextFunction) {
    try {
      await this.authService.logout(req.refresh_token_decoded_payload);

      res.clearCookie('refreshToken');
      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }
}
