import { ObjectId } from 'mongodb';
import { APP_ROUTES } from '../../src/routing';
import { ICreateBlogPayload } from '../../src/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '../../src/types/blogs/updateBlogBody';
import { req } from '../helper';
import { ICreatePostBody } from '../../src/types/posts/createPostBody';
import { GetAllBlogsQuery } from '../../src/types/blogs/getAllBlogsQuery';

export function getCreateBlogPayload({
  name = 'new blog',
  description = 'new blog description',
  websiteUrl = 'https://example-domain.com/blog-post/123/',
}: Partial<ICreateBlogPayload>): ICreateBlogPayload {
  return {
    name,
    description,
    websiteUrl,
  };
}

export const getAllBlogs = async (params: GetAllBlogsQuery = {}) => {
  const { searchNameTerm = null, sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10 } = params;

  const query = new URLSearchParams({
    ...(searchNameTerm !== null ? { searchNameTerm } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(pageNumber ? { pageNumber: String(pageNumber) } : {}),
    ...(pageSize ? { pageSize: String(pageSize) } : {}),
  });

  return await req.get(`${APP_ROUTES.BLOGS}?${query.toString()}`).set('Accept', 'application/json');
};

export async function getTestBlogById(blogId: ObjectId) {
  const request = req.get(`${APP_ROUTES.BLOGS}/${blogId}`);
  return await request;
}

export async function createTestBlog(blogToCreate: ICreateBlogPayload, isAuth: boolean) {
  const request = req.post(APP_ROUTES.BLOGS).send(blogToCreate);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  const res = await request;
  return res;
}

export async function createTestPostForBlog(newPost: ICreatePostBody, isAuth: boolean) {
  const request = req.post(`${APP_ROUTES.BLOGS}/${newPost.blogId}${APP_ROUTES.POSTS}`).send(newPost);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  const res = await request;
  return res;
}

export async function updateTestBlog(blogId: ObjectId, updateBlogBody: IUpdateBlogPayload, isAuth: boolean) {
  const request = req.put(`${APP_ROUTES.BLOGS}/${blogId}`).send(updateBlogBody);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  const res = await request;
  return res;
}

export async function deleteTestBlog(blogId: ObjectId, isAuth: boolean) {
  const request = req.delete(`${APP_ROUTES.BLOGS}/${blogId}`);

  if (isAuth) {
    request.set('Authorization', `Basic ${btoa(process.env.AUTH_CREDENTIALS!)}`);
  }

  return await request;
}
