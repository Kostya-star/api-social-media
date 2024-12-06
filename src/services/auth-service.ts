import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import UsersRepository from '@/repositories/users/users-repository-commands';
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
import { ACCESS_TOKEN_EXP_TIME, REFRESH_TOKEN_EXP_TIME } from '@/const/tokens-exp-time';
import SessionsService from './sessions-service';
import SessionsRepository from '@/repositories/sessions/sessions-repository-commands';
import { IRefreshTokenDecodedPayload } from '@/types/refresh-token-decoded-payload';
import { getISOFromUnixSeconds } from '@/util/get-iso-from-unix-secs';
import { IChangeUserPasswordPayload } from '@/types/auth/auth-change-password-payload';
import { IUserDB } from '@/types/users/user';

const selfRegistration = async (newUser: ICreateUserBody): Promise<void> => {
  const emailConfirmation = EmailConfirmationDTO();

  const createdUser = await UsersService.createUser(newUser, emailConfirmation);

  const message = EmailMessageDTO('registration-confirmation', 'Confirm registration', 'code', emailConfirmation.code!);

  try {
    await MailService.sendMail("'Igor' kostya.danilov.99@mail.ru", newUser.email, 'Registration Confirmation', message);
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
      message: AuthErrorsList.CODE_INCORRECT,
    };
  }

  if (user.emailConfirmation!.isConfirmed) {
    throw {
      field: 'code',
      message: AuthErrorsList.CODE_BEEN_APPLIED,
    };
  }

  const isExpired = isAfter(new Date(), user.emailConfirmation!.expDate as Date);

  if (isExpired) {
    throw {
      field: 'code',
      message: AuthErrorsList.CODE_EXPIRED,
    };
  }

  await UsersService.updateUserById(user._id, { emailConfirmation: { ...user.emailConfirmation, isConfirmed: true } as IEmailConfirmationBody });
};

const resendCode = async (email: string): Promise<void> => {
  const user = await UsersRepository.findUserByFilter({ email });

  if (!user) {
    throw {
      field: 'email',
      message: AuthErrorsList.EMAIL_WRONG,
    };
  }

  if (user.emailConfirmation!.isConfirmed) {
    throw {
      field: 'email',
      message: AuthErrorsList.CODE_BEEN_APPLIED,
    };
  }

  const emailConfirmation = EmailConfirmationDTO();

  await UsersService.updateUserById(user._id, { emailConfirmation });

  const message = EmailMessageDTO('registration-confirmation', 'Confirm registration', 'code', emailConfirmation.code!);
  await MailService.sendMail("'Petr' kostya.danilov.99@mail.ru", user.email, 'Registration Confirmation', message);
};

const login = async (
  { loginOrEmail, password }: IAuthLoginPayload,
  userAgent: string,
  ipAddress: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await UsersRepository.findUserByFilter({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

  if (!user) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword!);

  if (!isPasswordValid) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const deviceId = uuidv4();

  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: ACCESS_TOKEN_EXP_TIME });
  const refreshToken = jwt.sign({ userId: user._id, deviceId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_EXP_TIME });

  const { iat, exp } = jwt.decode(refreshToken) as IRefreshTokenDecodedPayload;

  const iatISO = getISOFromUnixSeconds(iat);
  const expISO = getISOFromUnixSeconds(exp);

  await SessionsService.createSession({ deviceId, userId: user._id, issuedAt: iatISO, expiresAt: expISO, userAgent, ipAddress, lastActiveDate: iatISO });

  return { accessToken, refreshToken };
};

const refreshToken = async ({ userId, deviceId, iat }: IRefreshTokenDecodedPayload): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await UsersRepository.getUserById(userId);

  if (!user) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const session = await SessionsRepository.findSessionById(deviceId);

  if (!session) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  // make sure the token isn't revoked
  if (getISOFromUnixSeconds(iat) !== session.issuedAt) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: ACCESS_TOKEN_EXP_TIME });
  const refreshToken = jwt.sign({ userId, deviceId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_EXP_TIME });

  {
    const { iat, exp } = jwt.decode(refreshToken) as IRefreshTokenDecodedPayload;

    const iatISO = getISOFromUnixSeconds(iat);
    const expISO = getISOFromUnixSeconds(exp);

    // revoke the token by updating the issuedAt prop of the session
    await SessionsService.updateSession(deviceId, { issuedAt: iatISO, lastActiveDate: iatISO, expiresAt: expISO });
  }

  return { accessToken, refreshToken };
};

const recoverPassword = async (ToEmail: string): Promise<void> => {
  const user = await UsersRepository.findUserByFilter({ email: ToEmail });

  const passwordConfirmation = EmailConfirmationDTO();

  if (user) {
    await UsersService.updateUserById(user._id, { passwordConfirmation });
  } else return;

  const message = EmailMessageDTO('password-recovery', 'Recover password', 'recoveryCode', passwordConfirmation.code!);

  await MailService.sendMail("'Kolya' kostya.danilov.99@mail.ru", ToEmail, 'Recover password', message);
};

const changePassword = async ({ newPassword, recoveryCode }: IChangeUserPasswordPayload): Promise<void> => {
  const user = await UsersRepository.findUserByFilter({ 'passwordConfirmation.code': recoveryCode });

  if (!user) {
    throw {
      field: 'recoveryCode',
      message: AuthErrorsList.CODE_INCORRECT,
    };
  }

  const isExpired = isAfter(new Date(), user.passwordConfirmation.expDate as Date);

  if (isExpired) {
    throw {
      field: 'recoveryCode',
      message: AuthErrorsList.CODE_EXPIRED,
    };
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  const updates: Partial<IUserDB> = {
    hashedPassword: newHashedPassword,
    passwordConfirmation: { code: null, expDate: null },
  };

  await UsersService.updateUserById(user._id, updates);
};

const logout = async ({ userId, deviceId, iat }: IRefreshTokenDecodedPayload): Promise<void> => {
  const user = await UsersRepository.getUserById(userId);

  if (!user) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const session = await SessionsRepository.findSessionById(deviceId);

  if (!session) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  if (getISOFromUnixSeconds(iat) !== session.issuedAt) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  await SessionsService.deleteSessionById(userId, deviceId);
};

export default {
  selfRegistration,
  confirmRegistration,
  resendCode,
  login,
  refreshToken,
  recoverPassword,
  changePassword,
  logout,
};

function EmailConfirmationDTO(): IEmailConfirmationBody {
  return {
    code: uuidv4(),
    expDate: add(new Date(), {
      minutes: 5,
    }),
    isConfirmed: false,
  };
}

function EmailMessageDTO(link: string, subj: string, queryParam: string, code: string): string {
  return `
  <h1>${subj}</h1>
  <p>To finish, please follow the link below:
      <a href='http://localhost:8000/auth/${link}?${queryParam}=${code}'>${subj}</a>
  </p>
  <b>You have 5 minutes!</b>
  `;
}
