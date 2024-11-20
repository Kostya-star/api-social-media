import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ObjectId } from 'mongodb';
import { ErrorService } from '@/services/error-service';
import { IBaseQuery } from '@/types/base-query';
import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/const/query-defaults';
import { ICreateUserBody } from '@/types/users/createUserBody';
import UsersService from '@/services/users-service';
import { IUser } from '@/types/users/user';
import { GetAllUsersQuery } from '@/types/users/getAllUsersQuery';
import UsersRepository from '@/repositories/users-repository';
import { IBaseResponse } from '@/types/base-response';

const getAllUsers = async (req: Request<any, any, any, GetAllUsersQuery>, res: Response<IBaseResponse<IUser>>, next: NextFunction) => {
  try {
    const searchLoginTerm = req.query.searchLoginTerm || null;
    const searchEmailTerm = req.query.searchEmailTerm || null;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
    const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
    const pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

    const users = await UsersRepository.getAllUsers({ searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize });

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req: Request<any, any, ICreateUserBody>, res: Response, next: NextFunction) => {
  const newUser = req.body;

  try {
    const user = await UsersService.createUser(newUser);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(user);
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

const deleteUser = async (req: Request<{ userId: ObjectId }>, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  try {
    await UsersService.deleteUser(userId);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  getAllUsers,
  createUser,
  deleteUser,
};
