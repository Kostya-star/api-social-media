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

// const getAllUsers = async (req: Request<any, any, any, GetAllBlogsQuery>, res: Response, next: NextFunction) => {
//   try {
//     const searchNameTerm = req.query.searchNameTerm || null;
//     const sortBy = req.query.sortBy || 'createdAt';
//     const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
//     const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
//     const pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

//     const blogs = await BlogsRepository.getAllBlogs({ searchNameTerm, sortBy, sortDirection, pageNumber, pageSize });

//     res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blogs);
//   } catch (err) {
//     next(err);
//   }
// };

const createUser = async (req: Request<any, any, ICreateUserBody>, res: Response<IUser>, next: NextFunction) => {
  const newUser = req.body;

  try {
    const user = await UsersService.createUser(newUser);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(user);
  } catch (err) {
    next(err);
  }
};

// const deleteUser = async (req: Request<{ blogId: ObjectId }>, res: Response, next: NextFunction) => {
//   const blogId = req.params.blogId;

//   try {
//     await BlogsService.deleteBlog(blogId);

//     res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
//   } catch (err) {
//     next(err);
//   }
// };

export default {
  // getAllUsers,
  createUser,
  // deleteUser,
};
