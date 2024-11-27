import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { AuthErrorsList } from '../../src/errors/auth-errors';
import { baseUser, createTestUser, deleteTestUser } from '../users/helpers';
import { refreshTokenRequest } from './helpers';
import { HTTP_ERROR_MESSAGES } from '../../src/const/http-error-messages';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_EXP_TIME } from '../../src/const/tokens-exp-time';

let testUserId: ObjectId | null;
let refreshToken: string;

describe('AUTH REFRESH TOKEN POST request', () => {
  beforeAll(async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;

    // Generate refresh token for the test user
    refreshToken = jwt.sign({ userId: testUserId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_EXP_TIME });
  });

  afterAll(async () => {
    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }
  });

  test('Successful refresh token = 200', async () => {
    const response = await refreshTokenRequest(refreshToken);
    expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);

    const newAccessToken = response.body.accessToken;
    expect(newAccessToken).toBeDefined();

    // Verify the access token is valid by checking if it's a JWT
    const decoded = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET!);
    expect(decoded).toHaveProperty('userId', testUserId?.toString());
  });

  test('Failed refresh token with invalid token = 401', async () => {
    const response = await refreshTokenRequest('invalid_refresh_token');
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });

  test('Failed refresh token with expired token = 401', async () => {
    // Generate an expired refresh token
    const expiredToken = jwt.sign({ userId: testUserId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '-10s' });

    const response = await refreshTokenRequest(expiredToken);
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });

  test('Failed refresh token with missing token = 400', async () => {
    const response = await refreshTokenRequest('');
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });

  test('Failed refresh token with non-existent user = 401', async () => {
    // Generate a refresh token for a non-existent user ID
    const nonExistentToken = jwt.sign({ userId: new ObjectId().toString() }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '100s' });

    const response = await refreshTokenRequest(nonExistentToken);
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });
});
