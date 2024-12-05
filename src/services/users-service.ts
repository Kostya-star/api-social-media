import { ObjectId } from 'mongodb';
import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateUserBody } from '@/types/users/createUserBody';
import UsersRepository from '@/repositories/users-repository';
import bcrypt from 'bcrypt';
import { UsersErrorsList } from '@/errors/users-errors';
import { IEmailConfirmationBody } from '@/types/users/email-confirmation-body';
import { IUserDB } from '@/types/users/user';
import { MongooseObjtId } from '@/types/mongoose-object-id';

const createUser = async (user: ICreateUserBody, emailConfirmation?: IEmailConfirmationBody): Promise<IUserDB> => {
  const { email, login, password } = user;

  const [userWithSameLogin, userWithSameEmail] = await Promise.all([UsersRepository.findUserByFilter({ login }), UsersRepository.findUserByFilter({ email })]);

  if (userWithSameLogin || userWithSameEmail) {
    throw {
      field: userWithSameLogin ? 'login' : 'email',
      message: userWithSameLogin ? UsersErrorsList.LOGIN_ALREADY_EXIST : UsersErrorsList.EMAIL_ALREADY_EXIST,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: Partial<IUserDB> = {
    login,
    email,
    hashedPassword,
    // default values emailConfirmation and passowrdConfirmation fields are automatically added by mongoose if missing
    emailConfirmation,
  };

  return await UsersRepository.createUser(newUser);
};

const updateUserById = async (userId: MongooseObjtId, newUser: Partial<IUserDB>): Promise<void> => {
  if (!ObjectId.isValid(userId)) {
    throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const userToUpdate = await UsersRepository.getUserById(userId);

  if (!userToUpdate) {
    throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await UsersRepository.updateUserById(userId, newUser);
};

const deleteUser = async (userId: MongooseObjtId): Promise<void> => {
  if (!ObjectId.isValid(userId)) {
    throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const userToDelete = await UsersRepository.findUserByFilter({ _id: userId });

  if (!userToDelete) {
    throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await UsersRepository.deleteUser(userId);
};

export default {
  createUser,
  updateUserById,
  deleteUser,
};
