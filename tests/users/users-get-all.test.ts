import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { APP_ROUTES } from '../../src/routing';
import { req } from '../helper';
import {
  baseUser,
  createTestUser,
  deleteTestUser,
  getAllUsers
} from './helpers';
import { ObjectId } from 'mongodb';

let testUserIds: ObjectId[] = [];

describe('USERS GET ALL request', () => {
  beforeEach(async () => {
    await req.delete(APP_ROUTES.TESTING);
  });

  afterEach(async () => {
    for (const userId of testUserIds) {
      await deleteTestUser(userId, true);
    }
    testUserIds = [];
  });

  test('status check', async () => {
    const res = await getAllUsers({}, true);
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
  });

  test('should return a list of users', async () => {
    const user1 = await createTestUser({ ...baseUser, login: 'User1', email: 'example1@example.com' }, true);
    const user2 = await createTestUser({ ...baseUser, login: 'User2', email: 'example2@example.com' }, true);
    const user3 = await createTestUser({ ...baseUser, login: 'User3', email: 'example3@example.com' }, true);

    testUserIds.push(user1.body.id, user2.body.id, user3.body.id);

    const res = await getAllUsers({}, true);

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items.length).toBeGreaterThanOrEqual(3);
  });

  test('should return paginated users with pageNumber and pageSize parameters', async () => {
    const usersToCreate = 5;
    for (let i = 1; i <= usersToCreate; i++) {
      const user = await createTestUser({ ...baseUser, login: `User${i}`, email: `example${i}@example.com`  }, true);
      testUserIds.push(user.body.id);
    }

    const res1 = await getAllUsers({ pageNumber: 1, pageSize: 2 }, true);
    expect(res1.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res1.body.items).toHaveLength(2);

    const res2 = await getAllUsers({ pageNumber: 2, pageSize: 2 }, true);
    expect(res2.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res2.body.items).toHaveLength(2);

    const res3 = await getAllUsers({ pageNumber: 3, pageSize: 2 }, true);
    expect(res3.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res3.body.items).toHaveLength(1);
  });

  test('401 error should occur', async () => {
    const res = await getAllUsers({ pageNumber: 1, pageSize: 2, searchLoginTerm: 'User' }, false);
    expect(res.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });

  test('should filter users by searchLoginTerm', async () => {
    const user1 = await createTestUser({ ...baseUser, login: 'FirstUser', email: 'example1@example.com' }, true);
    const user2 = await createTestUser({ ...baseUser, login: 'SecondUser', email: 'example2@example.com' }, true);
    const user3 = await createTestUser({ ...baseUser, login: 'ThirdUser', email: 'example3@example.com' }, true);
    
    
    testUserIds.push(user1.body.id, user2.body.id, user3.body.id);
    
    const res = await getAllUsers({ searchLoginTerm: 'SECOND' }, true);
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].login).toBe('SecondUser');
  });
  
  test('should handle search with no matching results', async () => {
    const user1 = await createTestUser({ ...baseUser, login: 'AlphaUser', email: 'example1@example.com' }, true);
    const user2 = await createTestUser({ ...baseUser, login: 'BetaUser', email: 'example2@example.com' }, true);

    testUserIds.push(user1.body.id, user2.body.id);

    const res = await getAllUsers({ searchLoginTerm: 'NonExistent' }, true);
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items).toHaveLength(0);
  });

  test('should handle invalid pagination parameters gracefully', async () => {
    const user = await createTestUser(baseUser, true);
    testUserIds.push(user.body.id);

    // @ts-ignore
    const res = await getAllUsers({ pageNumber: 'invalid', pageSize: 'invalid' }, true);

    expect([HTTP_STATUS_CODES.BAD_REQUEST_400, HTTP_STATUS_CODES.SUCCESS_200]).toContain(res.status);

    if (res.status === HTTP_STATUS_CODES.SUCCESS_200) {
      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(10);
    }
  });

  test('should sort users by createdAt in ascending and descending order', async () => {
    const user1 = await createTestUser({ ...baseUser, login: 'UserA', email: 'example1@example.com' }, true);
    const user2 = await createTestUser({ ...baseUser, login: 'UserB', email: 'example2@example.com' }, true);
    const user3 = await createTestUser({ ...baseUser, login: 'UserC', email: 'example3@example.com' }, true);

    testUserIds.push(user1.body.id, user2.body.id, user3.body.id);

    const resAsc = await getAllUsers({ sortBy: 'createdAt', sortDirection: 'asc' }, true);
    expect(resAsc.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(resAsc.body.items[0].login).toBe('UserA');
    expect(resAsc.body.items[1].login).toBe('UserB');
    expect(resAsc.body.items[2].login).toBe('UserC');

    const resDesc = await getAllUsers({ sortBy: 'createdAt', sortDirection: 'desc' }, true);
    expect(resDesc.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(resDesc.body.items[0].login).toBe('UserC');
    expect(resDesc.body.items[1].login).toBe('UserB');
    expect(resDesc.body.items[2].login).toBe('UserA');
  });

  test('should return an empty user list when no users exist', async () => {
    const res = await getAllUsers({}, true);
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items).toHaveLength(0);
  });
});
