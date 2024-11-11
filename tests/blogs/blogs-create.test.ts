import { APP_ROUTES } from '../../src/settings/routing';
import { req } from '../helper';
import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { mockDB } from '../../src/mockDB/index';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { blogToCreate, checkWrongValidation, createTestBlog, deleteTestBlog } from './common';

let testBlogId: string | null;

describe('BLOGS CREATE request', () => {
  afterEach(async () => {
    if (testBlogId) {
      await deleteTestBlog(testBlogId, true);
      testBlogId = null;
    }
  });

  test('status check with auth = 201', async () => {
    const blog = await createTestBlog(true);
    testBlogId = blog.body.id;

    expect(blog.headers['content-type']).toMatch(/json/);
    expect(blog.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
  });
  test('status check with NO auth = 401', async () => {
    const blog = await createTestBlog(false);
    testBlogId = blog.body.id;

    expect(blog.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('response check', async () => {
    const blog = await createTestBlog(true);
    testBlogId = blog.body.id;

    expect(blog.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
    expect(blog.body).toMatchObject(blogToCreate);
    expect(mockDB.blogs.length).toBeGreaterThan(0);
    expect(blog.body).toHaveProperty('id');
    expect(blog.body).toHaveProperty('name');
    expect(blog.body).toHaveProperty('description');
    expect(blog.body).toHaveProperty('websiteUrl');
  });

  describe('CHECK VALIDATION', () => {
    afterEach(async () => {
      if (testBlogId) {
        await deleteTestBlog(testBlogId, true);
        testBlogId = null;
      }
    });

    checkWrongValidation('name not specified', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, name: '' }, [
      { field: 'name', message: BlogsErrorsList.NAME_EMPTY },
    ]);
    checkWrongValidation('name wrong format', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, name: 55 }, [
      { field: 'name', message: BlogsErrorsList.NAME_WRONG_FORMAT },
    ]);
    checkWrongValidation('name too long', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, name: 'a'.repeat(20) }, [
      { field: 'name', message: BlogsErrorsList.NAME_EXCEEDED_LENGTH },
    ]);

    checkWrongValidation('description not specified', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, description: '' }, [
      { field: 'description', message: BlogsErrorsList.DESCRIPTION_EMPTY },
    ]);
    checkWrongValidation('description wrong format', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, description: null }, [
      { field: 'description', message: BlogsErrorsList.DESCRIPTION_WRONG_FORMAT },
    ]);
    checkWrongValidation('description too long', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, description: 'a'.repeat(501) }, [
      { field: 'description', message: BlogsErrorsList.DESCRIPTION_EXCEEDED_LENGTH },
    ]);

    checkWrongValidation('websiteUrl not specified', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, websiteUrl: '' }, [
      { field: 'websiteUrl', message: BlogsErrorsList.URL_EMPTY },
    ]);
    checkWrongValidation('websiteUrl wrong format', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, websiteUrl: 221 }, [
      { field: 'websiteUrl', message: BlogsErrorsList.URL_WRONG_FORMAT },
    ]);
    checkWrongValidation('websiteUrl invalid', 'post', APP_ROUTES.BLOGS, { ...blogToCreate, websiteUrl: 'edfsfddsf' }, [
      { field: 'websiteUrl', message: BlogsErrorsList.URL_INVALID },
    ]);
  });
});
