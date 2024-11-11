import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { createTestBlog, deleteTestBlog, getTestBlogById } from './helpers';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { IErrorItem } from '../../src/types/error-item';
describe('BLOGS GET BY ID request', () => {
  let testBlogId: string | null = null;

  beforeAll(async () => {
    const blog = await createTestBlog(true);
    testBlogId = blog.body.id;
  });

  afterAll(async () => {
    // Clean up by deleting the test data
    if (testBlogId) {
      await deleteTestBlog(testBlogId, true);
      testBlogId = null;
    }
  });

  test('status check', async () => {
    const blog = await getTestBlogById(testBlogId!);

    expect(blog.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
  });
  test('status check with wrong blogId', async () => {
    const blog = await getTestBlogById('123456hbgfdfdasfaopjadodviuseffne');
    expect(blog.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);

    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(blog.body).toEqual(error);
  });
  test('response check', async () => {
    const blog = await getTestBlogById(testBlogId!);

    expect(blog.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);

    expect(blog.body).toHaveProperty('id');
    expect(blog.body).toHaveProperty('name');
    expect(blog.body).toHaveProperty('description');
    expect(blog.body).toHaveProperty('websiteUrl');
  });
});
