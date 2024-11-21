import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { AuthErrorsList } from '../../src/errors/auth-errors';
import { baseUser, createTestUser, deleteTestUser } from '../users/helpers';
import { loginUser} from './helpers';
import { HTTP_ERROR_MESSAGES } from '../../src/const/http-error-messages';
import { ObjectId } from 'mongodb';

let testUserId: ObjectId | null;

describe('AUTH LOGIN POST request', () => {
  beforeAll(async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }
  });

  test('Successful login with email = 204', async () => {
    const response = await loginUser({ loginOrEmail: baseUser.email, password: baseUser.password });
    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  test('Successful login with username = 204', async () => {
    const response = await loginUser({ loginOrEmail: baseUser.login, password: baseUser.password });
    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  test('Failed login with incorrect password = 401', async () => {
    const response = await loginUser({ loginOrEmail: baseUser.login, password: 'wrong_pass' });
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });

  test('Failed login with non-existent user = 401', async () => {
    const response = await loginUser({ loginOrEmail: 'User2', password: baseUser.password });
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });
});

// Validation Tests for Login
describe('AUTH LOGIN Validation Tests', () => {
  const validationTests = [
    {
      name: 'Should return 400 if loginOrEmail is not specified',
      payload: { loginOrEmail: '', password: baseUser.password },
      expectedField: 'loginOrEmail',
      expectedMessage: AuthErrorsList.LOGIN_OR_EMAIL_WRONG,
    },
    {
      name: 'Should return 400 if loginOrEmail is in an invalid format',
      payload: { loginOrEmail: 'invalid#email.com', password: baseUser.password },
      expectedField: 'loginOrEmail',
      expectedMessage: AuthErrorsList.LOGIN_OR_EMAIL_WRONG,
    },
    {
      name: 'Should return 400 if password is not specified',
      payload: { loginOrEmail: baseUser.login, password: '' },
      expectedField: 'password',
      expectedMessage: AuthErrorsList.PASSWORD_WRONG,
    },
    {
      name: 'Should return 400 if password is too short',
      payload: { loginOrEmail: baseUser.login, password: '12' },
      expectedField: 'password',
      expectedMessage: AuthErrorsList.PASSWORD_WRONG,
    },
  ];

  validationTests.forEach(({ name, payload, expectedField, expectedMessage }) => {
    test(name, async () => {
      const response = await loginUser(payload);
      expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(response.body.errorsMessages).toContainEqual({
        field: expectedField,
        message: expectedMessage,
      });
    });
  });
});
