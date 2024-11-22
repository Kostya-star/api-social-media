import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { HTTP_ERROR_MESSAGES } from '../../src/const/http-error-messages';
import { createTestUser, deleteTestUser, baseUser } from '../users/helpers';
import { loginUser, getMe } from './helpers';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

let testUserId: ObjectId | null;
let accessToken: string | null;

describe('AUTH ME GET request', () => {
  beforeAll(async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;

    const loginResponse = await loginUser({ loginOrEmail: baseUser.email, password: baseUser.password });
    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }
  });

  test('Successful auth/me with valid token = 200', async () => {
    const response = await getMe(accessToken!);
    expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(response.body).toEqual({
      userId: testUserId,
      email: baseUser.email,
      login: baseUser.login,
    });
  });

  test('Failed auth/me with no token = 401', async () => {
    const response = await getMe();
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });

  test('Failed auth/me with invalid token = 401', async () => {
    const response = await getMe('invalid_token');
    console.log('response.body', response.body)
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });

  // test('Failed auth/me with expired token = 401', async () => {
  //   const expiredToken = jwt.sign({ userId: testUserId }, process.env.TOKEN_SECRET!, { expiresIn: '-1h' });
  //   const response = await getMe(`Bearer ${expiredToken}`);
  //   expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  //   const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
  //   expect(response.body).toEqual(error);
  // });
});
