import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { UsersErrorsList } from '../../src/errors/users-errors';
import { ICreateUserBody } from '../../src/types/users/createUserBody';
import { createTestUser, deleteTestUser, getAllUsers, getCreateUserPayload } from './helpers';
import { ObjectId } from 'mongodb';

let testUserId: ObjectId | null;

// General API Tests
describe('USERS CREATE POST request', () => {
  afterEach(async () => {
    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }
  });

  test('status check with auth = 201', async () => {
    const user = await createTestUser(getCreateUserPayload({ login: 'User1', email: 'example1@example.com', password: 'password' }), true);
    testUserId = user.body.id;

    expect(user.headers['content-type']).toMatch(/json/);
    expect(user.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
  });

  test('status check with NO auth = 401', async () => {
    const user = await createTestUser(getCreateUserPayload({ login: 'User1', email: 'example1@example.com', password: 'password' }), false);
    expect(user.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });

  test('response check', async () => {
    const newUser = { login: 'User1', email: 'example1@example.com', password: 'password' };

    const user = await createTestUser(newUser, true);
    testUserId = user.body.id;

    expect(user.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
    expect(user.body).toHaveProperty('id');
    expect(user.body).toHaveProperty('login', newUser.login);
    expect(user.body).toHaveProperty('email', newUser.email);
    expect(user.body).toHaveProperty('createdAt');

    const res = await getAllUsers({}, true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });
  test('should return 400 if email already exists', async () => {
    const newUser = { login: 'User1', email: 'example1@example.com', password: 'password' };

    const user1 = await createTestUser(newUser, true);
    testUserId = user1.body.id;
    expect(user1.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);

    const user2 = await createTestUser({ ...newUser, login: 'newLogin' }, true);
    expect(user2.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(user2.body).toEqual({
      errorsMessages: [
        {
          field: 'email',
          message: UsersErrorsList.EMAIL_ALREADY_EXIST,
        },
      ],
    });
  });
  test('should return 400 if login already exists', async () => {
    const newUser = { login: 'User1', email: 'example1@example.com', password: 'password' };

    const user1 = await createTestUser(newUser, true);
    testUserId = user1.body.id;
    expect(user1.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);

    const user2 = await createTestUser({ ...newUser, email: 'example1@example.com' }, true);
    expect(user2.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(user2.body).toEqual({
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
  afterEach(async () => {
    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }
  });

  const user: ICreateUserBody = { login: 'User1', email: 'example1@example.com', password: 'password' };

  const validationTests = [
    {
      name: 'Should return 400 if login is not specified',
      payload: getCreateUserPayload({ ...user, login: '' }),
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_SHORT,
    },
    {
      name: 'Should return 400 if login is in wrong format',
      // @ts-ignore
      payload: getCreateUserPayload({ ...user, login: 55 }),
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_IS_NOT_STRING,
    },
    {
      name: 'Should return 400 if login is in wrong format',
      payload: getCreateUserPayload({ ...user, login: ',_-*/-+&' }),
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if login exceeds max length',
      payload: getCreateUserPayload({ ...user, login: 'a'.repeat(51) }),
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_BIG,
    },
    {
      name: 'Should return 400 if login is too short',
      payload: getCreateUserPayload({ ...user, login: 'a' }),
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_SHORT,
    },
    {
      name: 'Should return 400 if email is not specified',
      payload: getCreateUserPayload({ ...user, email: '' }),
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if email is not string',
      // @ts-ignore
      payload: getCreateUserPayload({ ...user, email: 5564 }),
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_IS_NOT_STRING,
    },
    {
      name: 'Should return 400 if email is in wrong format',
      payload: getCreateUserPayload({ ...user, email: 'invalid-email' }),
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if password is not specified',
      payload: getCreateUserPayload({ ...user, password: '' }),
      expectedField: 'password',
      expectedMessage: UsersErrorsList.PASSWORD_TOO_SHORT,
    },
    {
      name: 'Should return 400 if password is too short',
      payload: getCreateUserPayload({ ...user, password: '123' }),
      expectedField: 'password',
      expectedMessage: UsersErrorsList.PASSWORD_TOO_SHORT,
    },
  ];

  validationTests.forEach(({ name, payload, expectedField, expectedMessage }) => {
    test(name, async () => {
      const user = await createTestUser(payload, true);
      expect(user.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(user.body.errorsMessages).toContainEqual({
        field: expectedField,
        message: expectedMessage,
      });
    });
  });
});
