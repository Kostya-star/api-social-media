import { ObjectId, Sort } from 'mongodb';
import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { IUser } from '@/types/users/user';
import UsersRepository from '@/repositories/users-repository';
import bcrypt from 'bcrypt';

const createUser = async (user: ICreateUserBody): Promise<IUser> => {
  const { email, login, password } = user;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: IUser = {
    login,
    email,
    hashedPassword,
    createdAt: new Date()
  }
  return await UsersRepository.createUser(newUser);
};

// const deleteBlog = async (blogId: ObjectId): Promise<void> => {
//   if (!ObjectId.isValid(blogId)) {
//     throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
//   }

//   const blogToDelete = await BlogsRepository.getBlogById(blogId);

//   if (!blogToDelete) {
//     throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
//   }

//   await BlogsRepository.deleteBlog(blogId);
// };

export default {
  createUser,
  // deleteBlog,
};
