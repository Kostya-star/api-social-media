import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import UsersRepository from '@/repositories/users-repository';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ICreateUserBody } from '@/types/users/createUserBody';
import UsersService from './users-service';
import { v4 as uuidv4 } from 'uuid';
import { add, isAfter } from 'date-fns';
import { IEmailConfirmationBody } from '@/types/users/email-confirmation-body';
import MailService from './mail-service';
import { AuthErrorsList } from '@/errors/auth-errors';

const selfRegistration = async (newUser: ICreateUserBody): Promise<void> => {
  const emailConfirmation: IEmailConfirmationBody = {
    code: uuidv4(),
    expDate: add(new Date(), {
      minutes: 5,
    }),
    isConfirmed: false,
  };

  const createdUser = await UsersService.createUser(newUser, emailConfirmation);

  const message = `<h1>Thanks for your registration</h1>
  <p>To finish, please follow the link and
      <a href='http://localhost:8000/auth/registration-confirmation?code=${emailConfirmation.code}'>confirm registration</a>
  </p>
  <b>You have 5 minutes!</b>
  `;

  try {
    await MailService.sendMail("'Constantin' kostya.danilov.99@mail.ru", newUser.email, 'Registration Confirmation', message);
  } catch (err) {
    await UsersService.deleteUser(createdUser._id);
    throw err;
  }
};

const confirmRegistration = async (code: string): Promise<void> => {
  const user = await UsersRepository.findUserByFilter({ 'emailConfirmation.code': code });

  if (!user) {
    throw {
      field: 'code',
      message: AuthErrorsList.CONFIRM_CODE_INCORRECT,
    };
  }

  if (user.emailConfirmation!.isConfirmed) {
    throw {
      field: 'code',
      message: AuthErrorsList.CONFIRM_CODE_BEEN_APPLIED,
    };
  }

  const isExpired = isAfter(new Date(), user.emailConfirmation!.expDate as Date);

  if (isExpired) {
    throw {
      field: 'code',
      message: AuthErrorsList.CONFIRM_CODE_EXPIRED,
    };
  }

  await UsersService.updateUserById(user._id, { emailConfirmation: { ...user.emailConfirmation, isConfirmed: true } as IEmailConfirmationBody });
};

const login = async ({ loginOrEmail, password }: IAuthLoginPayload): Promise<string> => {
  const user = await UsersRepository.findUserByFilter({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

  if (!user) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword!);

  if (!isPasswordValid) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET!);

  return token;
};

export default {
  selfRegistration,
  confirmRegistration,
  login,
};
