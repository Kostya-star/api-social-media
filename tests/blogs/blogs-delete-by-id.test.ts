import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { createTestBlog, deleteTestBlog, getTestBlogById } from './common';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { IErrorItem } from '../../src/types/error-item';

describe('BLOGS DELETE BY ID request', () => {
  let testBlogId: string | null = null;

  beforeEach(async () => {
    const blog = await createTestBlog(true);
    testBlogId = blog.body.id;
  });

  afterEach(async () => {
    if (testBlogId) {
      await deleteTestBlog(testBlogId, true);
      testBlogId = null;
    }
  });
  test('status check. should be 204', async () => {
    const res = await deleteTestBlog(testBlogId!, true);
    testBlogId = null;
    expect(res.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
  });
  test('status check. should be 401', async () => {
    const res = await deleteTestBlog(testBlogId!, false);
    testBlogId = null;

    expect(res.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('status check. should be 404 coz no blog found', async () => {
    const res = await deleteTestBlog('12345678utygewxr2e12e12211221qw', true);
    testBlogId = null;

    expect(res.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(res.body).toEqual(error);
  });
  test('successful deletion. blog is deleted from DB and cant be found anymore', async () => {
    const res = await deleteTestBlog(testBlogId!, true);
    testBlogId = null;

    expect(res.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const blog = await getTestBlogById(testBlogId!);
    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(blog.body).toEqual(error);
  });
});
