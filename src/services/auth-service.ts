import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import UsersRepository from '@/repositories/users-repository';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const login = async ({ loginOrEmail, password }: IAuthLoginPayload): Promise<string> => {
  const user = await UsersRepository.findUserByFilter({ $or: [ { login: loginOrEmail }, { email: loginOrEmail } ] });
  
  if (!user) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword!);
  
  if (!isPasswordValid) {
    throw ErrorService(HTTP_ERROR_MESSAGES.UNAUTHORIZED_401, HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }
  
  // TODO. how to handle process.env.TOKEN_SECRET
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET!) 

  return token
};

export default {
  login,
};
