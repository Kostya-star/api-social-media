import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import AuthService from '@/services/auth-service';
import { ObjectId, WithId } from 'mongodb';
import UsersRepository from '@/repositories/users-repository';
import { IUser } from '@/types/users/user';
import { userObjMapper } from '@/util/userObjMapper';

const login = async (req: Request<any, any, IAuthLoginPayload>, res: Response<{ accessToken: string }>, next: NextFunction) => {
  try {
    const token = await AuthService.login(req.body);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ accessToken: token });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req: Request, res: Response<{ email: string; login: string; userId: ObjectId }>, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const { email, login, _id } = (await UsersRepository.findUserByFilter({ _id: new ObjectId(userId) })) as WithId<IUser>;

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({ email, login, userId: _id });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
  getMe,
};
