import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { getAllBlogs } from './common';

describe('BLOGS GET ALL request', () => {
  test('status check', async () => {
    const res = await getAllBlogs();
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
