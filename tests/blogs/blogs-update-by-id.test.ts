import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { createTestBlog, deleteTestBlog, getCreateBlogPayload, getTestBlogById, updateTestBlog } from './helpers';
import { IErrorItem } from '../../src/types/error-item';
import { IUpdateBlogPayload } from '../../src/types/blogs/updateBlogBody';
import { ObjectId } from 'mongodb';

let testBlogId: string | null;

describe('BLOGS UPDATE BY ID request', () => {
  beforeEach(async () => {
    const res = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = res.body.id;
  });

  afterEach(async () => {
    // if (testBlogId) {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
    // }
  });

  test('status check with auth = 204', async () => {
    const blog = await updateTestBlog(testBlogId!, getUpdateBlogPayload({}), true);

    expect(blog.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
  });
  test('status check with NO auth = 401', async () => {
    const blog = await updateTestBlog(testBlogId!, getUpdateBlogPayload({}), false);

    expect(blog.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('status check = 404', async () => {
    //@ts-ignore
    const blog = await updateTestBlog('qwefgdfvl,mjohn812ne32r829rf', getUpdateBlogPayload({}), true);

    expect(blog.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);

    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(blog.body).toEqual(error);
  });
  test('response check', async () => {
    const blog = await updateTestBlog(testBlogId!, getUpdateBlogPayload({}), true);

    expect(blog.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const updatedBlog = await getTestBlogById(testBlogId!);

    expect(updatedBlog.body).toMatchObject(getUpdateBlogPayload({}));
    expect(updatedBlog.body).toHaveProperty('name', getUpdateBlogPayload({}).name);
    expect(updatedBlog.body).toHaveProperty('description', getUpdateBlogPayload({}).description);
    expect(updatedBlog.body).toHaveProperty('websiteUrl', getUpdateBlogPayload({}).websiteUrl);
    expect(updatedBlog.body).toHaveProperty('createdAt');
    expect(updatedBlog.body).toHaveProperty('isMembership', false);

  });
});

describe('CHECK VALIDATION for BLOGS update /put request', () => {
  beforeEach(async () => {
    const res = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = res.body.id;
  });

  afterEach(async () => {
    // if (testBlogId) {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
    // }
  });

  const tests = [
    {
      name: 'Should return 400 if name is not specified',
      payload: getUpdateBlogPayload({ name: '' }),
      expectedField: 'name',
      expectedMessage: BlogsErrorsList.NAME_EMPTY,
    },
    {
      name: 'Should return 400 if name is not trimmed',
      payload: getUpdateBlogPayload({ name: '   ' }),
      expectedField: 'name',
      expectedMessage: BlogsErrorsList.NAME_EMPTY,
    },
    {
      name: 'Should return 400 if name is in wrong format',
      // @ts-ignore
      payload: getUpdateBlogPayload({ name: 55 }),
      expectedField: 'name',
      expectedMessage: BlogsErrorsList.NAME_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if name exceeds max length',
      // @ts-ignore
      payload: getUpdateBlogPayload({ name: 'a'.repeat(20) }),
      expectedField: 'name',
      expectedMessage: BlogsErrorsList.NAME_EXCEEDED_LENGTH,
    },
    {
      name: 'Should return 400 if description is not specified',
      // @ts-ignore
      payload: getUpdateBlogPayload({ description: '' }),
      expectedField: 'description',
      expectedMessage: BlogsErrorsList.DESCRIPTION_EMPTY,
    },
    {
      name: 'Should return 400 if description is not trimmed',
      // @ts-ignore
      payload: getUpdateBlogPayload({ description: '   ' }),
      expectedField: 'description',
      expectedMessage: BlogsErrorsList.DESCRIPTION_EMPTY,
    },
    {
      name: 'Should return 400 if description is in wrong format',
      // @ts-ignore
      payload: getUpdateBlogPayload({ description: null }),
      // @ts-ignore
      payload: getUpdateBlogPayload({ description: null }),
      expectedField: 'description',
      expectedMessage: BlogsErrorsList.DESCRIPTION_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if description exceeds max length',
      // @ts-ignore
      payload: getUpdateBlogPayload({ description: 'a'.repeat(501) }),
      expectedField: 'description',
      expectedMessage: BlogsErrorsList.DESCRIPTION_EXCEEDED_LENGTH,
    },
    {
      name: 'Should return 400 if websiteUrl is not specified',
      // @ts-ignore
      payload: getUpdateBlogPayload({ websiteUrl: '' }),
      expectedField: 'websiteUrl',
      expectedMessage: BlogsErrorsList.URL_EMPTY,
    },
    {
      name: 'Should return 400 if websiteUrl is not trimmed',
      // @ts-ignore
      payload: getUpdateBlogPayload({ websiteUrl: '   ' }),
      expectedField: 'websiteUrl',
      expectedMessage: BlogsErrorsList.URL_EMPTY,
    },
    {
      name: 'Should return 400 if websiteUrl is in wrong format',
      // @ts-ignore
      payload: getUpdateBlogPayload({ websiteUrl: 221 }),
      expectedField: 'websiteUrl',
      expectedMessage: BlogsErrorsList.URL_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if websiteUrl is invalid',
      // @ts-ignore
      payload: getUpdateBlogPayload({ websiteUrl: 'edfsfddsf' }),
      expectedField: 'websiteUrl',
      expectedMessage: BlogsErrorsList.URL_INVALID,
    },
  ];

  tests.forEach(({ name, payload, expectedField, expectedMessage }) => {
    test(name, async () => {
      const blog = await updateTestBlog(testBlogId!, payload, true)
      expect(blog.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(blog.body.errorsMessages).toContainEqual({
        field: expectedField,
        message: expectedMessage,
      });
    });
  });
});


function getUpdateBlogPayload({
  name = 'updated name',
  description = 'updated description',
  websiteUrl = 'https://example-domain.com/blog-updated/456/',
}: Partial<IUpdateBlogPayload>): IUpdateBlogPayload {
  return {
    name,
    description,
    websiteUrl,
  };
}

