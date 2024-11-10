import { APP_ROUTES } from '../../src/settings/routing';
import { req } from '../helper';
import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { blogToCreate, createTestBlog } from './common';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { IErrorItem } from '../../src/types/error-item';
describe('BLOGS GET POST BY ID request', () => {
  let testBlogId: string;

  beforeAll(async () => {
    testBlogId = await createTestBlog();
    console.log('testBlogId:', testBlogId);
  });

  // TODO - delte testBlog from DB

  // afterAll(async () => {
  //   // Clean up by deleting the test data
  //   if (testBlogId) {
  // await deleteTestBlog
  //   }
  // });
  test('status check', async () => {
    await req.get(`${APP_ROUTES.BLOGS}/${testBlogId}`).expect(HTTP_STATUS_CODES.SUCCESS_200);
  });
  test('status check with wrong blogId', async () => {
    const res = await req.get(`${APP_ROUTES.BLOGS}/123456hbgfdfdasfaopjadodviuseffne`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(res.body).toEqual(error);
  });
  test('response check', async () => {
    const res = await req.get(`${APP_ROUTES.BLOGS}/${testBlogId}`).expect(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('websiteUrl');
  });
});
