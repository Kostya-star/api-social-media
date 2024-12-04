import { IChangeUserPasswordPayload } from '@/types/auth/auth-change-password-payload';
import { checkFor400Error } from '../check-for-400-error';
import { validatePassword } from './validate-password';

export const validateUserPasswordMdlwr = [validatePassword(), checkFor400Error<IChangeUserPasswordPayload>];
