import { APP_ROUTES } from '../../src/settings/routing';
import { req } from '../helper';
import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { ICreateBlogPayload } from '../../src/types/blogs/createBlogBody';
import { mockDB } from '../../src/mockDB/index';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { blogToCreate } from './common';

describe('BLOGS CREATE request', () => {
  // beforeAll(async () => {
  //   // Set up the test data with a POST request
  //   const response = await request(app)
  //     .post('/blogs')
  //     .send({ title: 'Test Blog', content: 'Content for testing' });

  //   testBlogId = response.body.id;
  //   expect(response.status).toBe(201);
  // });

  // afterAll(async () => {
  //   // Clean up by deleting the test data
  //   if (testBlogId) {
  //     await request(app).delete(`/blogs/${testBlogId}`);
  //   }
  // });

  // TODO - delte testBlog from DB
  test('status check with auth = 201', async () => {
    const res = await req
      .post(APP_ROUTES.BLOGS)
      .set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`)
      .send(blogToCreate)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.SUCCESS_201);
  });
  test('status check with NO auth', async () => {
    await req.post(APP_ROUTES.BLOGS).send(blogToCreate).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('response check', async () => {
    const res = await req
      .post(APP_ROUTES.BLOGS)
      .send(blogToCreate)
      .set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`)
      .expect(HTTP_STATUS_CODES.SUCCESS_201);

    expect(res.body).toMatchObject(blogToCreate);
    expect(mockDB.blogs.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('websiteUrl');
  });

  describe('CHECK VALIDATION', () => {
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

function checkWrongValidation(
  caseName: string,
  requestType: 'post' | 'put',
  requestUrl: string,
  payload: Record<string, any>,
  errorsMessagesArr: { field: string; message: any }[]
) {
  test(caseName, async () => {
    const res = await req[requestType](requestUrl)
      .send(payload)
      .set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(res.body).toEqual({
      errorsMessages: errorsMessagesArr,
    });
  });
}
