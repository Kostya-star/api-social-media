import { ObjectId, Sort, WithId } from 'mongodb';
import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { IUser } from '@/types/users/user';
import UsersRepository from '@/repositories/users-repository';
import bcrypt from 'bcrypt';
import { UsersErrorsList } from '@/errors/users-errors';
import { IEmailConfirmationBody } from '@/types/users/email-confirmation-body';

const createUser = async (user: ICreateUserBody, emailConfirmation?: IEmailConfirmationBody): Promise<WithId<IUser>> => {
  const { email, login, password } = user;

  const [userWithSameLogin, userWithSameEmail] = await Promise.all([UsersRepository.findUserByFilter({ login }), UsersRepository.findUserByFilter({ email })]);

  if (userWithSameLogin || userWithSameEmail) {
    throw {
      field: userWithSameLogin ? 'login' : 'email',
      message: userWithSameLogin ? UsersErrorsList.LOGIN_ALREADY_EXIST : UsersErrorsList.EMAIL_ALREADY_EXIST,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: IUser = {
    login,
    email,
    hashedPassword,
    // default values when created by admin
    emailConfirmation: emailConfirmation || {
      code: null,
      expDate: null,
      isConfirmed: true,
    },
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
