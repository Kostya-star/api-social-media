import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import AuthService from '@/services/auth-service';
import { ObjectId, WithId } from 'mongodb';
import UsersRepository from '@/repositories/users-repository';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { IUserDB } from '@/types/users/user';
import { IChangeUserPasswordPayload } from '@/types/auth/auth-change-password-payload';

// user registers themselves without admin
const selfRegistration = async (req: Request<any, any, ICreateUserBody>, res: Response, next: NextFunction) => {
  try {
    const newUser = req.body;

    await AuthService.selfRegistration(newUser);

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
};

const registrationConfirmation = async (req: Request<any, any, { code: string }>, res: Response, next: NextFunction) => {
  try {
    const code = req.body.code;

    await AuthService.confirmRegistration(code);

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
};

const registrationEmailCodeResending = async (req: Request<any, any, { email: string }>, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;

    await AuthService.resendCode(email);

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
};

const login = async (req: Request<any, any, IAuthLoginPayload>, res: Response<{ accessToken: string }>, next: NextFunction) => {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown device';
    const ipAddress = req.ip;

    const { accessToken, refreshToken } = await AuthService.login(req.body, userAgent, ipAddress!);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req: Request, res: Response<{ accessToken: string }>, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = await AuthService.refreshToken(req.refresh_token_decoded_payload);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const recoverPassword = async (req: Request<any, any, { email: string }>, res: Response<void>, next: NextFunction) => {
  try {
    await AuthService.recoverPassword(req.body.email);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req: Request<any, any, IChangeUserPasswordPayload>, res: Response<{ accessToken: string }>, next: NextFunction) => {
  try {
    await AuthService.changePassword(req.body);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const getMe = async (req: Request, res: Response<{ email: string; login: string; userId: ObjectId }>, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const { email, login, _id } = (await UsersRepository.findUserByFilter({ _id: userId})) as IUserDB;

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ email, login, userId: _id });
  } catch (err) {
    next(err);
  }
};

const logout = async (req: Request, res: Response<void>, next: NextFunction) => {
  try {
    await AuthService.logout(req.refresh_token_decoded_payload);

    res.clearCookie('refreshToken');
    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  selfRegistration,
  registrationConfirmation,
  registrationEmailCodeResending,
  login,
  refreshToken,
  recoverPassword,
  changePassword,
  getMe,
  logout,
};
