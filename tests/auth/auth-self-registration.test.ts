import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { UsersErrorsList } from '../../src/errors/users-errors';
import { APP_ROUTES } from '../../src/routing';
import { ICreateUserBody } from '../../src/types/users/createUserBody';
import { req } from '../helper';
import { baseUser, deleteTestUser, getAllUsers } from '../users/helpers';
import { selfRegister, selfRegisterUserBody } from './helpers';

describe('USERS CREATE POST request', () => {
  beforeEach(async () => {
    await req.delete(APP_ROUTES.TESTING)
  });

  test('success status check = 204', async () => {
    const res = await selfRegister(selfRegisterUserBody);
    console.log(res.body)
    expect(res.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const users = await getAllUsers({}, true);
    expect(users.body.items.length).toBeGreaterThan(0);
  });

  test('should return 400 if email already exists', async () => {
    const auth1 = await selfRegister(selfRegisterUserBody);
    expect(auth1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
    
    const auth2 = await selfRegister({ ...selfRegisterUserBody, login: 'newLogin' });
    expect(auth2.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(auth2.body).toEqual({
      errorsMessages: [
        {
          field: 'email',
          message: UsersErrorsList.EMAIL_ALREADY_EXIST,
        },
      ],
    });
  });
  test('should return 400 if login already exists', async () => {
    const auth1 = await selfRegister(selfRegisterUserBody);
    expect(auth1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
    
    const auth2 = await selfRegister({ ...selfRegisterUserBody, email: selfRegisterUserBody.email });
    expect(auth2.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(auth2.body).toEqual({
      errorsMessages: [
        {
          field: 'login',
          message: UsersErrorsList.LOGIN_ALREADY_EXIST,
        },
      ],
    });
  });
});

// Validation Tests
describe('USERS CREATE Validation Tests', () => {
  beforeEach(async () => {
    await req.delete(APP_ROUTES.TESTING)
  });

  const validationTests = [
    {
      name: 'Should return 400 if login is not specified',
      payload: { ...selfRegisterUserBody, login: '' },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_SHORT,
    },
    {
      name: 'Should return 400 if login is in wrong format',
      // @ts-ignore
      payload: { ...selfRegisterUserBody, login: 55 },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_IS_NOT_STRING,
    },
    {
      name: 'Should return 400 if login is in wrong format',
      payload: { ...selfRegisterUserBody, login: ',_-*/-+&' },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if login exceeds max length',
      payload: { ...selfRegisterUserBody, login: 'a'.repeat(51) },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_BIG,
    },
    {
      name: 'Should return 400 if login is too short',
      payload: { ...selfRegisterUserBody, login: 'a' },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_SHORT,
    },
    {
      name: 'Should return 400 if email is not specified',
      payload: { ...selfRegisterUserBody, email: '' },
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if email is not string',
      // @ts-ignore
      payload: { ...selfRegisterUserBody, email: 5564 },
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_IS_NOT_STRING,
    },
    {
      name: 'Should return 400 if email is in wrong format',
      payload: { ...selfRegisterUserBody, email: 'invalid-email' },
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if password is not specified',
      payload: { ...selfRegisterUserBody, password: '' },
      expectedField: 'password',
      expectedMessage: UsersErrorsList.PASSWORD_TOO_SHORT,
    },
    {
      name: 'Should return 400 if password is too short',
      payload: { ...selfRegisterUserBody, password: '123' },
      expectedField: 'password',
      expectedMessage: UsersErrorsList.PASSWORD_TOO_SHORT,
    },
  ];

  validationTests.forEach(({ name, payload, expectedField, expectedMessage }) => {
    test(name, async () => {
      const user = await selfRegister(payload as ICreateUserBody);
      expect(user.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(user.body.errorsMessages).toContainEqual({
        field: expectedField,
        message: expectedMessage,
      });
    });
  });
});
