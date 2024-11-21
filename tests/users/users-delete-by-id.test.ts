import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { IUser } from '../../src/types/users/user';
import { createTestUser, deleteTestUser, getAllUsers, getCreateUserPayload } from './helpers';
import { ObjectId } from 'mongodb';

let testUserId: ObjectId | null;

describe('USERS DELETE request', () => {
  beforeEach(async () => {
    const user = await createTestUser(getCreateUserPayload({ login: 'User1', email: 'example1@example.com', password: 'password' }), true);
    testUserId = user.body.id;
  });

  afterEach(async () => {
    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }
  });

  test('status check with auth = 204', async () => {
    const response = await deleteTestUser(testUserId!, true);
    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const users = await getAllUsers({}, true);
    const userExists = users.body.items.some((user: IUser) => user.id === testUserId);
    expect(userExists).toBe(false);
  });

  test('status check with NO auth = 401', async () => {
    const response = await deleteTestUser(testUserId!, false);
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);

    // Ensure the user still exists since deletion was unauthorized
    const users = await getAllUsers({}, true);
    const userExists = users.body.items.some((user: IUser) => user.id === testUserId);
    expect(userExists).toBe(true);
  });

  test('response check for non-existent user = 404', async () => {
    await deleteTestUser(testUserId!, true);

    const response = await deleteTestUser(testUserId!, true);
    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });

  test('response check with user wrong id = 404', async () => {
    // @ts-ignore
    const response = await deleteTestUser('1236spld++-/+.01462s;lq=1', true);
    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });
});
