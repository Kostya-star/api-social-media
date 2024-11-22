import { APP_ROUTES } from '../../src/routing';
import { req } from '../helper';
import { IAuthLoginPayload } from '../../src/types/auth/auth-login-payload';

export const loginUser = async (payload: IAuthLoginPayload) => {
  return await req.post(`${APP_ROUTES.AUTH}/login`).send(payload);
};

export const getMe = async (token?: string) => {
  const request = req.get(`${APP_ROUTES.AUTH}/me`);
  
  if (token) {
    request.set('Authorization', `Bearer ${token}`);
  }

  return await request;
};
