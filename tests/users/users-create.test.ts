import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { UsersErrorsList } from '../../src/errors/users-errors';
import { ICreateUserBody } from '../../src/types/users/createUserBody';
import { baseUser, createTestUser, deleteTestUser, getAllUsers } from './helpers';
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
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;

    expect(user.headers['content-type']).toMatch(/json/);
    expect(user.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
  });

  test('status check with NO auth = 401', async () => {
    const user = await createTestUser(baseUser, false);
    expect(user.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });

  test('response check', async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;

    expect(user.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
    expect(user.body).toHaveProperty('id');
    expect(user.body).toHaveProperty('login', baseUser.login);
    expect(user.body).toHaveProperty('email', baseUser.email);
    expect(user.body).toHaveProperty('createdAt');

    const res = await getAllUsers({}, true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });
  test('should return 400 if email already exists', async () => {
    const user1 = await createTestUser(baseUser, true);
    testUserId = user1.body.id;
    expect(user1.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);

    const user2 = await createTestUser({ ...baseUser, login: 'newLogin' }, true);
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
    const user1 = await createTestUser(baseUser, true);
    testUserId = user1.body.id;
    expect(user1.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);

    const user2 = await createTestUser({ ...baseUser, email: 'example1@example.com' }, true);
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

  const validationTests = [
    {
      name: 'Should return 400 if login is not specified',
      payload: { ...baseUser, login: '' },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_SHORT,
    },
    {
      name: 'Should return 400 if login is in wrong format',
      // @ts-ignore
      payload: { ...baseUser, login: 55 },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_IS_NOT_STRING,
    },
    {
      name: 'Should return 400 if login is in wrong format',
      payload: { ...baseUser, login: ',_-*/-+&' },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if login exceeds max length',
      payload: { ...baseUser, login: 'a'.repeat(51) },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_BIG,
    },
    {
      name: 'Should return 400 if login is too short',
      payload: { ...baseUser, login: 'a' },
      expectedField: 'login',
      expectedMessage: UsersErrorsList.LOGIN_TOO_SHORT,
    },
    {
      name: 'Should return 400 if email is not specified',
      payload: { ...baseUser, email: '' },
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if email is not string',
      // @ts-ignore
      payload: { ...baseUser, email: 5564 },
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_IS_NOT_STRING,
    },
    {
      name: 'Should return 400 if email is in wrong format',
      payload: { ...baseUser, email: 'invalid-email' },
      expectedField: 'email',
      expectedMessage: UsersErrorsList.EMAIL_INVALID_PATTERN,
    },
    {
      name: 'Should return 400 if password is not specified',
      payload: { ...baseUser, password: '' },
      expectedField: 'password',
      expectedMessage: UsersErrorsList.PASSWORD_TOO_SHORT,
    },
    {
      name: 'Should return 400 if password is too short',
      payload: { ...baseUser, password: '123' },
      expectedField: 'password',
      expectedMessage: UsersErrorsList.PASSWORD_TOO_SHORT,
    },
  ];

  validationTests.forEach(({ name, payload, expectedField, expectedMessage }) => {
    test(name, async () => {
      const user = await createTestUser(payload as ICreateUserBody, true);
      expect(user.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(user.body.errorsMessages).toContainEqual({
        field: expectedField,
        message: expectedMessage,
      });
    });
  });
});
