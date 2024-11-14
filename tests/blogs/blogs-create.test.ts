import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { createTestBlog, deleteTestBlog, getAllBlogs, getCreateBlogPayload } from './helpers';
// import { MongoClient, ObjectId } from 'mongodb';

let testBlogId: string | null;

describe('BLOGS CREATE request', () => {
  afterEach(async () => {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
  });

  test('status check with auth = 201', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body.id;

    expect(blog.headers['content-type']).toMatch(/json/);
    expect(blog.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
  });
  test('status check with NO auth = 401', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), false);
    testBlogId = blog.body.id;

    expect(blog.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('response check', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body.id;

    expect(blog.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
    expect(blog.body).toMatchObject(getCreateBlogPayload({}));
    expect(blog.body).toHaveProperty('id');
    expect(blog.body).toHaveProperty('name');
    expect(blog.body).toHaveProperty('description');
    expect(blog.body).toHaveProperty('websiteUrl');
    expect(blog.body).toHaveProperty('createdAt');
    expect(blog.body).toHaveProperty('isMembership', false);

    const res = await getAllBlogs();
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// Validation
describe('BLOGS CREATE Validation Tests', () => {
  afterEach(async () => {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
  });

  const tests = [
    {
      name: 'Should return 400 if name is not specified',
      payload: getCreateBlogPayload({ name: '' }),
      expectedField: 'name',
      expectedMessage: BlogsErrorsList.NAME_EMPTY,
    },
    {
      name: 'Should return 400 if name is not trimmed',
      payload: getCreateBlogPayload({ name: '    ' }),
      expectedField: 'name',
      expectedMessage: BlogsErrorsList.NAME_EMPTY,
    },
    {
      name: 'Should return 400 if name is in wrong format',
      // @ts-ignore
      payload: getCreateBlogPayload({ name: 55 }),
      expectedField: 'name',
      expectedMessage: BlogsErrorsList.NAME_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if name exceeds max length',
      // @ts-ignore
      payload: getCreateBlogPayload({ name: 'a'.repeat(20) }),
      expectedField: 'name',
      expectedMessage: BlogsErrorsList.NAME_EXCEEDED_LENGTH,
    },
    {
      name: 'Should return 400 if description is not specified',
      // @ts-ignore
      payload: getCreateBlogPayload({ description: '' }),
      expectedField: 'description',
      expectedMessage: BlogsErrorsList.DESCRIPTION_EMPTY,
    },
    {
      name: 'Should return 400 if description is not trimmed',
      // @ts-ignore
      payload: getCreateBlogPayload({ description: '   ' }),
      expectedField: 'description',
      expectedMessage: BlogsErrorsList.DESCRIPTION_EMPTY,
    },
    {
      name: 'Should return 400 if description is in wrong format',
      // @ts-ignore
      payload: getCreateBlogPayload({ description: null }),
      expectedField: 'description',
      expectedMessage: BlogsErrorsList.DESCRIPTION_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if description exceeds max length',
      // @ts-ignore
      payload: getCreateBlogPayload({ description: 'a'.repeat(501) }),
      expectedField: 'description',
      expectedMessage: BlogsErrorsList.DESCRIPTION_EXCEEDED_LENGTH,
    },
    {
      name: 'Should return 400 if websiteUrl is not specified',
      // @ts-ignore
      payload: getCreateBlogPayload({ websiteUrl: '' }),
      expectedField: 'websiteUrl',
      expectedMessage: BlogsErrorsList.URL_EMPTY,
    },
    {
      name: 'Should return 400 if websiteUrl is not trimmed',
      // @ts-ignore
      payload: getCreateBlogPayload({ websiteUrl: '   ' }),
      expectedField: 'websiteUrl',
      expectedMessage: BlogsErrorsList.URL_EMPTY,
    },
    {
      name: 'Should return 400 if websiteUrl is in wrong format',
      // @ts-ignore
      payload: getCreateBlogPayload({ websiteUrl: 234 }),
      expectedField: 'websiteUrl',
      expectedMessage: BlogsErrorsList.URL_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if websiteUrl is invalid',
      // @ts-ignore
      payload: getCreateBlogPayload({ websiteUrl: 'edfsfddsf' }),
      expectedField: 'websiteUrl',
      expectedMessage: BlogsErrorsList.URL_INVALID,
    },
  ];

  tests.forEach(({ name, payload, expectedField, expectedMessage }) => {
    test(name, async () => {
      const blog = await createTestBlog(payload, true);
      testBlogId = blog.body.id;
      expect(blog.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(blog.body.errorsMessages).toContainEqual({
        field: expectedField,
        message: expectedMessage,
      });
    });
  });
});