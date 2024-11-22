import { ObjectId } from 'mongodb';
import { APP_ROUTES } from '../../src/routing';
import { req } from '../helper';
import { ICreateUserBody } from '../../src/types/users/createUserBody';
import { GetAllUsersQuery } from '../../src/types/users/getAllUsersQuery';

export const baseUser: ICreateUserBody = { login: 'User1', email: 'example1@example.com', password: 'password' }

export const getAllUsers = async (params: GetAllUsersQuery = {}, isAuth: boolean) => {
  const { searchEmailTerm = null, searchLoginTerm = null, sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10 } = params;

  const query = new URLSearchParams({
    ...(searchEmailTerm !== null ? { searchEmailTerm } : {}),
    ...(searchLoginTerm !== null ? { searchLoginTerm } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(pageNumber ? { pageNumber: String(pageNumber) } : {}),
    ...(pageSize ? { pageSize: String(pageSize) } : {}),
  });

  const request = req.get(`${APP_ROUTES.USERS}?${query.toString()}`)
  
  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_BASIC_CREDENTIALS!)}`);
  }

  return await request;
};

export async function createTestUser(userToCreate: ICreateUserBody, isAuth: boolean) {
  const request = req.post(APP_ROUTES.USERS).send(userToCreate);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_BASIC_CREDENTIALS!)}`);
  }

  return await request;
}

export async function deleteTestUser(userId: ObjectId, isAuth: boolean) {
  const request = req.delete(`${APP_ROUTES.USERS}/${userId}`);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_BASIC_CREDENTIALS!)}`);
  }

  return await request;
}
