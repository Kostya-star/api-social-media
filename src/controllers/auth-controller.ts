import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import AuthService from '@/services/auth-service';
import { ObjectId } from 'mongodb';
import UsersRepository from '@/repositories/users-repository';
import { IUser } from '@/types/users/user';

const login = async (req: Request<any, any, IAuthLoginPayload>, res: Response<{ accessToken: string }>, next: NextFunction) => {
  try {
    const token = await AuthService.login(req.body);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ accessToken: token });
  } catch (err) {
    next(err);
  }
};

const me = async (req: Request, res: Response<IUser>, next: NextFunction) => {
  try {
    const userId = req.userId!

    const user = await UsersRepository.findUserByFilter({ _id: new ObjectId(userId) }) as IUser

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(user);
  } catch (err) {
    next(err);
  }
};

export default {
  login,
  me
};
