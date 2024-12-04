import { ICreateUserBody } from '@/types/users/createUserBody';
import { validateLogin } from './validate-login';
import { validatePassword } from './validate-password';
import { validateEmail } from './validate-email';
import { checkFor400Error } from '../check-for-400-error';

export const validateUserRegistrationFields = [validateLogin(), validatePassword('password'), validateEmail(), checkFor400Error<ICreateUserBody>];
