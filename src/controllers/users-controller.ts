import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ObjectId } from 'mongodb';
import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/const/query-defaults';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { GetAllUsersQuery } from '@/types/users/getAllUsersQuery';
import { IBaseResponse } from '@/types/base-response';
import { IUserView } from '@/types/users/user';
import { ErrorService } from '@/services/error-service';
import { UsersErrorsList } from '@/errors/users-errors';
import { UsersService } from '@/services/users-service';
import { UsersRepositoryQuery } from '@/repositories/users/users-repository-query';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/composition-root-types';

@injectable()
export class UsersController {
  protected usersService;
  protected usersRepositoryQuery;

  constructor(@inject(TYPES.usersService) usersService: UsersService, @inject(TYPES.usersRepositoryQuery) usersRepositoryQuery: UsersRepositoryQuery) {
    this.usersService = usersService;
    this.usersRepositoryQuery = usersRepositoryQuery;
  }

  async getAllUsers(req: Request<any, any, any, GetAllUsersQuery>, res: Response<IBaseResponse<IUserView>>, next: NextFunction) {
    try {
      const searchLoginTerm = req.query.searchLoginTerm || null;
      const searchEmailTerm = req.query.searchEmailTerm || null;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
      const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
      const _pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

      const resp = await this.usersRepositoryQuery.getAllUsers({
        searchLoginTerm,
        searchEmailTerm,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize: _pageSize,
      });

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
    } catch (err) {
      next(err);
    }
  }

  async adminCreatesUser(req: Request<any, any, ICreateUserBody>, res: Response<IUserView | unknown>, next: NextFunction) {
    const newUser = req.body;

    try {
      const userId = await this.usersService.createUser(newUser);
      const user = await this.usersRepositoryQuery.getUserById(userId);

      if (!user) {
        throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

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
  }

  async deleteUser(req: Request<{ userId: ObjectId }>, res: Response<void>, next: NextFunction) {
    const userId = req.params.userId;

    try {
      await this.usersService.deleteUser(userId);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }
}
