import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { AuthErrorsList } from '../../src/errors/auth-errors';
import { baseUser, createTestUser, deleteTestUser } from '../users/helpers';
import { loginUser, logoutRequest, refreshTokenRequest } from './helpers';
import { HTTP_ERROR_MESSAGES } from '../../src/const/http-error-messages';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_EXP_TIME } from '../../src/const/tokens-exp-time';
import RevokedTokensRepository from '../../src/repositories/revoked-tokens-repository';

let testUserId: ObjectId | null;
let refreshToken: string;

describe('AUTH REFRESH TOKEN POST request', () => {
  beforeAll(async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;
  });

  beforeEach(() => {
    // Generate refresh token for the test user
    refreshToken = jwt.sign({ userId: testUserId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_EXP_TIME });
  });

  afterAll(async () => {
    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }
  });
  test('should log out successfully and return 204 (No Content)', async () => {
    const response = await logoutRequest(refreshToken);
    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  // Test: Failed logout without refresh token (no cookies)
  test('should return 401 (Unauthorized) if no refresh token is provided in cookies', async () => {
    const response = await logoutRequest('');

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    expect(response.body).toEqual({
      status: HTTP_STATUS_CODES.UNAUTHORIZED_401,
      message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401,
    });
  });

  // Test: Failed logout with invalid refresh token format (malformed token in cookies)
  test('should return 401 (Unauthorized) if the refresh token is in an invalid format', async () => {
    const invalidToken = 'invalidToken123'; // Simulate an invalid token format
    const response = await logoutRequest(invalidToken);

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    expect(response.body).toEqual({
      status: HTTP_STATUS_CODES.UNAUTHORIZED_401,
      message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401,
    });
  });

  // Test: Failed logout due to revoked refresh token
  test('should return 401 (Unauthorized) if the refresh token has been revoked', async () => {
    // Simulate revoking the refresh token
    await RevokedTokensRepository.revokeToken(refreshToken); // Revoking the token

    const response = await logoutRequest(refreshToken); // Send the revoked refresh token
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    expect(response.body).toEqual({
      status: HTTP_STATUS_CODES.UNAUTHORIZED_401,
      message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401,
    });
  });
});
