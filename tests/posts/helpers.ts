import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { APP_ROUTES } from '../../src/settings/routing';
import { ICreatePostBody } from '../../src/types/posts/createPostBody';
import { IUpdateBlogPayload } from '../../src/types/blogs/updateBlogBody';
import { req } from '../helper';

export const getCreatePostPayload =
  (testBlogId: string) =>
  ({
    blogId = testBlogId,
    content = 'A valid content',
    shortDescription = 'A valid short description',
    title = 'A valid title',
  }: Partial<ICreatePostBody>): ICreatePostBody => {
    return {
      title,
      shortDescription,
      content,
      blogId,
    };
  };

export async function getAllPosts() {
  const request = req.get(APP_ROUTES.POSTS);
  return await request;
}

export async function getTestPostById(postId: string) {
  const request = req.get(`${APP_ROUTES.POSTS}/${postId}`);
  return await request;
}

export async function createTestPost(payload: ICreatePostBody, isAuth: boolean) {
  const request = req.post(APP_ROUTES.POSTS).send(payload);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  const res = await request;
  return res;
}

// export async function updateTestBlog(blogId: string, isAuth: boolean) {
//   const request = req.put(`${APP_ROUTES.BLOGS}/${blogId}`).send(updateBlogBody);

//   if (isAuth) {
//     request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
//   }

//   const res = await request;
//   return res;
// }

export async function deleteTestPost(postId: string, isAuth: boolean) {
  const request = req.delete(`${APP_ROUTES.BLOGS}/${postId}`);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  return await request;
}
