import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { getAllPosts } from './helpers';

describe('POSTS GET ALL request', () => {
  test('status check', async () => {
    const res = await getAllPosts();
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
