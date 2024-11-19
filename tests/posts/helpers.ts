import { APP_ROUTES } from '../../src/routing';
import { ICreatePostBody } from '../../src/types/posts/createPostBody';
import { req } from '../helper';
import { IUpdatePostBody } from '../../src/types/posts/updatePostBody';
import { ObjectId } from 'mongodb';
import { IBaseQuery } from '../../src/types/base-query';
import { IPost } from '../../src/types/posts/post';

export const getCreatePostPayload =
  (testBlogId: ObjectId) =>
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

export async function getAllPosts(params: IBaseQuery<IPost> = {}) {
  const { sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10 } = params;

  const query = new URLSearchParams({
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(pageNumber ? { pageNumber: String(pageNumber) } : {}),
    ...(pageSize ? { pageSize: String(pageSize) } : {}),
  });

  return await req.get(`${APP_ROUTES.POSTS}?${query.toString()}`);
}

export async function getTestPostById(postId: ObjectId) {
  const request = req.get(`${APP_ROUTES.POSTS}/${postId}`);
  return await request;
}

export async function getPostsForBlog(blogId: ObjectId, params: IBaseQuery<IPost> = {}) {
  const { sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10 } = params;

  const query = new URLSearchParams({
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(pageNumber ? { pageNumber: String(pageNumber) } : {}),
    ...(pageSize ? { pageSize: String(pageSize) } : {}),
  });

  return await req.get(`${APP_ROUTES.BLOGS}/${blogId}${APP_ROUTES.POSTS}?${query.toString()}`);
}

export async function createTestPost(payload: ICreatePostBody, isAuth: boolean) {
  const request = req.post(APP_ROUTES.POSTS).send(payload);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  const res = await request;
  return res;
}

export async function updateTestPost(postId: ObjectId, updateBlogBody: IUpdatePostBody, isAuth: boolean) {
  const request = req.put(`${APP_ROUTES.POSTS}/${postId}`).send(updateBlogBody);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  const res = await request;
  return res;
}

export async function deleteTestPost(postId: ObjectId, isAuth: boolean) {
  const request = req.delete(`${APP_ROUTES.POSTS}/${postId}`);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  return await request;
}
