import { ObjectId } from 'mongodb';
import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateUserBody } from '@/types/users/createUserBody';
import { UsersRepositoryCommands } from '@/repositories/users/users-repository-commands';
import bcrypt from 'bcrypt';
import { UsersErrorsList } from '@/errors/users-errors';
import { IEmailConfirmationBody } from '@/types/users/email-confirmation-body';
import { IUserDB } from '@/types/users/user';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/composition-root-types';

@injectable()
export class UsersService {
  protected usersRepository: UsersRepositoryCommands;

  constructor(@inject(TYPES.usersRepositoryCommands) usersRepository: UsersRepositoryCommands) {
    this.usersRepository = usersRepository;
  }

  async createUser(user: ICreateUserBody, emailConfirmation?: IEmailConfirmationBody): Promise<MongooseObjtId> {
    const { email, login, password } = user;

    const [userWithSameLogin, userWithSameEmail] = await Promise.all([
      this.usersRepository.findUserByFilter({ login }),
      this.usersRepository.findUserByFilter({ email }),
    ]);

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

    return await this.usersRepository.createUser(newUser);
  }

  async updateUserById(userId: MongooseObjtId, newUser: Partial<IUserDB>): Promise<void> {
    if (!ObjectId.isValid(userId)) {
      throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const userToUpdate = await this.usersRepository.getUserById(userId);

    if (!userToUpdate) {
      throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await this.usersRepository.updateUserById(userId, newUser);
  }

  async deleteUser(userId: MongooseObjtId): Promise<void> {
    if (!ObjectId.isValid(userId)) {
      throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const userToDelete = await this.usersRepository.findUserByFilter({ _id: userId });

    if (!userToDelete) {
      throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await this.usersRepository.deleteUser(userId);
  }
}
