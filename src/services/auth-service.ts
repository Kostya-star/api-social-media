import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { v4 as uuidv4 } from 'uuid';
import { add, isAfter } from 'date-fns';
import { IEmailConfirmationBody } from '@/types/users/email-confirmation-body';
import { AuthErrorsList } from '@/errors/auth-errors';
import { ACCESS_TOKEN_EXP_TIME, REFRESH_TOKEN_EXP_TIME } from '@/const/tokens-exp-time';
import { IRefreshTokenDecodedPayload } from '@/types/refresh-token-decoded-payload';
import { getISOFromUnixSeconds } from '@/util/get-iso-from-unix-secs';
import { IChangeUserPasswordPayload } from '@/types/auth/auth-change-password-payload';
import { IUserDB } from '@/types/users/user';
import { UsersService } from './users-service';
import { SessionsService } from './sessions-service';
import { SessionsRepositoryCommands } from '@/repositories/sessions/sessions-repository-commands';
import { UsersRepositoryCommands } from '@/repositories/users/users-repository-commands';
import { MailService } from './mail-service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/composition-root-types';

@injectable()
export class AuthService {
  protected usersRepository: UsersRepositoryCommands;
  protected mailService: MailService;
  protected usersService: UsersService;
  protected sessionsService: SessionsService;
  protected sessionsRepository: SessionsRepositoryCommands;

  constructor(
    @inject(TYPES.usersRepositoryCommands) usersRepository: UsersRepositoryCommands,
    @inject(TYPES.mailService) mailService: MailService,
    @inject(TYPES.usersService) usersService: UsersService,
    @inject(TYPES.sessionsService) sessionsService: SessionsService,
    @inject(TYPES.sessionsRepositoryCommands) sessionsRepository: SessionsRepositoryCommands
  ) {
    this.usersRepository = usersRepository;
    this.mailService = mailService;
    this.usersService = usersService;
    this.sessionsService = sessionsService;
    this.sessionsRepository = sessionsRepository;
  }

  async selfRegistration(newUser: ICreateUserBody): Promise<void> {
    const emailConfirmation = this.EmailConfirmationDTO();

    const createdUser = await this.usersService.createUser(newUser, emailConfirmation);

    const message = this.EmailMessageDTO('registration-confirmation', 'Confirm registration', 'code', emailConfirmation.code!);

    try {
      await this.mailService.sendMail("'Igor' kostya.danilov.99@mail.ru", newUser.email, 'Registration Confirmation', message);
    } catch (err) {
      await this.usersService.deleteUser(createdUser._id);
      throw err;
    }
  }

  async confirmRegistration(code: string): Promise<void> {
    const user = await this.usersRepository.findUserByFilter({ 'emailConfirmation.code': code });

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

    await this.usersService.updateUserById(user._id, { emailConfirmation: { ...user.emailConfirmation, isConfirmed: true } as IEmailConfirmationBody });
  }

  async resendCode(email: string): Promise<void> {
    const user = await this.usersRepository.findUserByFilter({ email });

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

    const emailConfirmation = this.EmailConfirmationDTO();

    await this.usersService.updateUserById(user._id, { emailConfirmation });

    const message = this.EmailMessageDTO('registration-confirmation', 'Confirm registration', 'code', emailConfirmation.code!);
    await this.mailService.sendMail("'Petr' kostya.danilov.99@mail.ru", user.email, 'Registration Confirmation', message);
  }

  async login({ loginOrEmail, password }: IAuthLoginPayload, userAgent: string, ipAddress: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersRepository.findUserByFilter({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

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

    await this.sessionsService.createSession({ deviceId, userId: user._id, issuedAt: iatISO, expiresAt: expISO, userAgent, ipAddress, lastActiveDate: iatISO });

    return { accessToken, refreshToken };
  }

  async refreshToken({ userId, deviceId, iat }: IRefreshTokenDecodedPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }

    const session = await this.sessionsRepository.findSessionById(deviceId);

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
      await this.sessionsService.updateSession(deviceId, { issuedAt: iatISO, lastActiveDate: iatISO, expiresAt: expISO });
    }

    return { accessToken, refreshToken };
  }

  async recoverPassword(ToEmail: string): Promise<void> {
    const user = await this.usersRepository.findUserByFilter({ email: ToEmail });

    const passwordConfirmation = this.EmailConfirmationDTO();

    if (user) {
      await this.usersService.updateUserById(user._id, { passwordConfirmation });
    } else return;

    const message = this.EmailMessageDTO('password-recovery', 'Recover password', 'recoveryCode', passwordConfirmation.code!);

    await this.mailService.sendMail("'Kolya' kostya.danilov.99@mail.ru", ToEmail, 'Recover password', message);
  }

  async changePassword({ newPassword, recoveryCode }: IChangeUserPasswordPayload): Promise<void> {
    const user = await this.usersRepository.findUserByFilter({ 'passwordConfirmation.code': recoveryCode });

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

    await this.usersService.updateUserById(user._id, updates);
  }

  async logout({ userId, deviceId, iat }: IRefreshTokenDecodedPayload): Promise<void> {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }

    const session = await this.sessionsRepository.findSessionById(deviceId);

    if (!session) {
      throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }

    if (getISOFromUnixSeconds(iat) !== session.issuedAt) {
      throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }

    await this.sessionsService.deleteSessionById(userId, deviceId);
  }

  EmailConfirmationDTO(): IEmailConfirmationBody {
    return {
      code: uuidv4(),
      expDate: add(new Date(), {
        minutes: 5,
      }),
      isConfirmed: false,
    };
  }

  EmailMessageDTO(link: string, subj: string, queryParam: string, code: string): string {
    return `
    <h1>${subj}</h1>
    <p>To finish, please follow the link below:
        <a href='http://localhost:8000/auth/${link}?${queryParam}=${code}'>${subj}</a>
    </p>
    <b>You have 5 minutes!</b>
    `;
  }
}
