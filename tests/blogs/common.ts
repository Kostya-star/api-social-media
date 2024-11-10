import { APP_ROUTES } from '../../src/settings/routing';
import { ICreateBlogPayload } from '../../src/types/blogs/createBlogBody';
import { req } from '../helper';

export const blogToCreate: ICreateBlogPayload = {
  name: 'new blog',
  description: 'new blog description',
  websiteUrl: 'https://example-domain.com/blog-post/123/',
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
  return res
}

export async function deleteTestBlog(blogId: string, isAuth: boolean) {
  const request = req.delete(`${APP_ROUTES.BLOGS}/${blogId}`);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  return await request;
}
