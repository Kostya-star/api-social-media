import { USER_LOGIN_MAX_LENGTH, USER_LOGIN_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@/const/users/users';

export enum UsersErrorsList {
  NOT_FOUND = 'User not found',

  LOGIN_IS_NOT_STRING = 'Login must be a string',
  LOGIN_TOO_BIG = `Login must not exceed ${USER_LOGIN_MAX_LENGTH} characters`,
  LOGIN_TOO_SHORT = `Login must be at least ${USER_LOGIN_MIN_LENGTH} characters long`,
  LOGIN_INVALID_PATTERN = `Login invalid pattern`,
  LOGIN_ALREADY_EXIST = `User with this login already exists`,

  PASSWORD_IS_NOT_STRING = 'Password must be a string',
  PASSWORD_TOO_BIG = `Password must not exceed ${USER_PASSWORD_MAX_LENGTH} characters`,
  PASSWORD_TOO_SHORT = `Password must be at least ${USER_PASSWORD_MIN_LENGTH} characters long`,

  EMAIL_IS_NOT_STRING = 'Email must be a string',
  EMAIL_INVALID_PATTERN = `Email invalid pattern`,
  EMAIL_ALREADY_EXIST = `User with this login already exists`,
}
