import { APP_ROUTES } from '../../src/settings/routing';
import { req } from '../helper';
import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';

describe('BLOGS GET ALL request', () => {
  test('status check', async () => {
    const res = await req.get(APP_ROUTES.BLOGS).expect(HTTP_STATUS_CODES.SUCCESS_200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
