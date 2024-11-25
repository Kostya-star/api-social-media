import { APP_ROUTES } from '../../src/routing';
import { req } from '../helper';
import { IAuthLoginPayload } from '../../src/types/auth/auth-login-payload';
import { ICreateUserBody } from '../../src/types/users/createUserBody';

export const selfRegisterUserBody: ICreateUserBody = {
  email: 'kostya.danilov.99@mail.ru',
  login: 'User1',
  password: 'password',
}

export const selfRegister = async (payload: ICreateUserBody) => {
  return await req.post(`${APP_ROUTES.AUTH}/registration`).send(payload);
};

export const confirmRegistration = async (code: string) => {
  return await req.post(`${APP_ROUTES.AUTH}/registration-confirmation`).send({ code });
};

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
