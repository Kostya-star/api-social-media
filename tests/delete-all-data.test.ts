import { HTTP_STATUS_CODES } from '../src/const/http-status-codes';
import { createTestBlog, deleteTestBlog, getAllBlogs, getCreateBlogPayload, getTestBlogById } from './blogs/helpers';
import { IErrorItem } from '../src/types/error-item';
import { createTestPost, deleteTestPost, getAllPosts, getCreatePostPayload, getTestPostById } from './posts/helpers';
import { PostsErrorsList } from '../src/errors/posts-errors';
import { req } from './helper';
import { APP_ROUTES } from '../src/routing';
import { BlogsErrorsList } from '../src/errors/blogs-errors';

describe('TESTING DELETE ROUTE testing/all-data', () => {
  let testBlogId: string | null = null;
  let testPostId: string | null = null;

  beforeAll(async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    const blogId = blog.body.id;
    testBlogId = blogId;
    const post = await createTestPost(getCreatePostPayload(blogId)({}), true);
    testPostId = post.body.id;
  });

  afterAll(async () => {
    // if (testBlogId) {
      await deleteTestBlog(testBlogId!, true)
      testBlogId = null;
    // }
    // if (testPostId) {
      await deleteTestPost(testPostId!, true)
      testPostId = null;
    // }
  })

  test('should delete all data in DB', async () => {
    const res = await req.delete(APP_ROUTES.TESTING);
    expect(res.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const blogs = await getAllBlogs();
    expect(blogs.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(Array.isArray(blogs.body)).toBe(true);
    expect(blogs.body).toHaveLength(0);

    const posts = await getAllPosts();
    expect(posts.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(Array.isArray(posts.body)).toBe(true);
    expect(posts.body).toHaveLength(0);

    const notFoundBlog = await getTestBlogById(testBlogId!);
    expect(notFoundBlog.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const blogError: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(notFoundBlog.body).toEqual(blogError);

    const notFoundPost = await getTestPostById(testPostId!);
    expect(notFoundPost.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const postError: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: PostsErrorsList.NOT_FOUND };
    expect(notFoundPost.body).toEqual(postError);
  });
});
