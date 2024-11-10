import { APP_ROUTES } from '../../src/settings/routing';
import { ICreateBlogPayload } from '../../src/types/blogs/createBlogBody';
import { req } from '../helper';

export const blogToCreate: ICreateBlogPayload = {
  name: 'new blog',
  description: 'new blog description',
  websiteUrl: 'https://example-domain.com/blog-post/123/',
};

export async function createTestBlog(): Promise<string> {
  const res = await req
    .post(APP_ROUTES.BLOGS)
    .send(blogToCreate)
    .set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  return res.body.id;
}

// export async function deleteTestBlog(blogId: string) {
//   const res = await req.delete(APP_ROUTES.BLOGS)
// }
