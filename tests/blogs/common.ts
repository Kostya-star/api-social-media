import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { APP_ROUTES } from '../../src/settings/routing';
import { ICreateBlogPayload } from '../../src/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '../../src/types/blogs/updateBlogBody';
import { req } from '../helper';

export const blogToCreate: ICreateBlogPayload = {
  name: 'new blog',
  description: 'new blog description',
  websiteUrl: 'https://example-domain.com/blog-post/123/',
};

export const updateBlogBody: IUpdateBlogPayload = {
  name: 'updated name',
  description: 'updated description',
  websiteUrl: 'https://example-domain.com/blog-updated/456/',
};

export async function getAllBlogs() {
  const request = req.get(APP_ROUTES.BLOGS);
  return await request;
}

export async function getTestBlogById(blogId: string) {
  const request = req.get(`${APP_ROUTES.BLOGS}/${blogId}`);
  return await request;
}

export async function createTestBlog(isAuth: boolean) {
  const request = req.post(APP_ROUTES.BLOGS).send(blogToCreate);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  const res = await request;
  return res;
}

export async function updateTestBlog(blogId: string, isAuth: boolean) {
  const request = req.put(`${APP_ROUTES.BLOGS}/${blogId}`).send(updateBlogBody);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  const res = await request;
  return res;
}

export async function deleteTestBlog(blogId: string, isAuth: boolean) {
  const request = req.delete(`${APP_ROUTES.BLOGS}/${blogId}`);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  return await request;
}

export function checkWrongValidation(
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
