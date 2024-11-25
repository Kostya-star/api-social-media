import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import AuthService from '@/services/auth-service';
import { ObjectId, WithId } from 'mongodb';
import UsersRepository from '@/repositories/users-repository';
import { IUser } from '@/types/users/user';
import { userObjMapper } from '@/util/userObjMapper';
import { ICreateUserBody } from '@/types/users/createUserBody';

// user registers themselves without admin
const selfRegistration = async (req: Request<any, any, ICreateUserBody>, res: Response, next: NextFunction) => {
  try {
    const newUser = req.body;

    await AuthService.selfRegistration(newUser);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end()
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
  selfRegistration,
  login,
  getMe,
};
