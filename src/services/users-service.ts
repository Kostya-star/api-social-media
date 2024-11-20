import { ObjectId, Sort } from 'mongodb';
import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { IUser } from '@/types/users/user';
import UsersRepository from '@/repositories/users-repository';
import bcrypt from 'bcrypt';
import { UsersErrorsList } from '@/errors/users-errors';

const createUser = async (user: ICreateUserBody): Promise<IUser> => {
  const { email, login, password } = user;

  const userWithSameLogin = await UsersRepository.findUserByFilter({ login });

  if (userWithSameLogin) {
    throw {
      field: 'login',
      message: UsersErrorsList.LOGIN_ALREADY_EXIST,
    }
  }

  const userWithSameEmail = await UsersRepository.findUserByFilter({ email });

  if (userWithSameEmail) {
    throw {
      field: 'email',
      message: UsersErrorsList.LOGIN_ALREADY_EXIST,
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: IUser = {
    login,
    email,
    hashedPassword,
    createdAt: new Date(),
  };
  return await UsersRepository.createUser(newUser);
};

const deleteUser = async (userId: ObjectId): Promise<void> => {
  if (!ObjectId.isValid(userId)) {
    throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const userToDelete = await UsersRepository.findUserByFilter({ _id: new ObjectId(userId) });

  if (!userToDelete) {
    throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await UsersRepository.deleteUser(userId);
};

export default {
  createUser,
  deleteUser,
};
