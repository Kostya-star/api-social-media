import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { getAllBlogs } from './helpers';

describe('BLOGS GET ALL request', () => {
  test('status check', async () => {
    const res = await getAllBlogs();
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});