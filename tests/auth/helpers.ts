import { APP_ROUTES } from '../../src/routing';
import { req } from '../helper';
import { IAuthLoginPayload } from '../../src/types/auth/auth-login-payload';

export const loginUser = async (payload: IAuthLoginPayload) => {
  return await req.post(`${APP_ROUTES.AUTH}/login`).send(payload);
};