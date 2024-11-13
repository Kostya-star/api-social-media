import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { createTestBlog, deleteTestBlog, getCreateBlogPayload, getTestBlogById } from './helpers';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { IErrorItem } from '../../src/types/error-item';
import { ObjectId } from 'mongodb';
describe('BLOGS GET BY ID request', () => {
  let testBlogId: ObjectId | null = null;

  beforeAll(async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body._id;
  });

  afterAll(async () => {
    await deleteTestBlog(testBlogId!, true);
    testBlogId = null;
  });

  test('status check', async () => {
    const blog = await getTestBlogById(testBlogId!);

    expect(blog.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
  });
  test('status check with wrong blogId', async () => {
    // @ts-ignore
    const blog = await getTestBlogById('123456hbgfdfdasfaopjadodviuseffne');
    expect(blog.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);

    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(blog.body).toEqual(error);
  });
  test('response check', async () => {
    const blog = await getTestBlogById(testBlogId!);

    expect(blog.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);

    expect(blog.body).toHaveProperty('_id');
    expect(blog.body).toHaveProperty('name');
    expect(blog.body).toHaveProperty('description');
    expect(blog.body).toHaveProperty('websiteUrl');
  });
});
