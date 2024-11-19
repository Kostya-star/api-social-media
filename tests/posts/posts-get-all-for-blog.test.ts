import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { APP_ROUTES } from '../../src/routing';
import { req } from '../helper';
import { createTestBlog, deleteTestBlog, getCreateBlogPayload } from '../blogs/helpers';
import { createTestPost, deleteTestPost, getCreatePostPayload, getPostsForBlog } from './helpers';
import { ObjectId } from 'mongodb';
import { IErrorItem } from '../../src/types/error-item';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';

let testBlogIds: ObjectId[] = [];
let testPostIds: ObjectId[] = [];

describe('POSTS GET ALL FOR A specific blog request', () => {
  beforeEach(async () => {
    await req.delete(APP_ROUTES.TESTING)
  });

  afterEach(async () => {
    for (const postId of testPostIds) {
      await deleteTestPost(postId, true)
    }
    testPostIds = [];

    for (const blogId of testBlogIds) {
      await deleteTestBlog(blogId, true);
    }
    testBlogIds = [];
  });

  test('status check for valid blog', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({ name: 'Blog for Posts' }), true);
    testBlogIds.push(blog.body.id);

    const res = await getPostsForBlog(blog.body.id);
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
  });

  test('should return paginated posts for a blog', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({ name: 'Blog with Posts' }), true);
    testBlogIds.push(blog.body.id);

    // Create multiple posts for the blog
    for (let i = 1; i <= 5; i++) {
      const post = await createTestPost(getCreatePostPayload(blog.body.id)({ title: `Post ${i}`, content: `Content for post ${i}` }), true);
      testPostIds.push(post.body.id);
    }

    const res1 = await getPostsForBlog(blog.body.id, { pageNumber: 1, pageSize: 2 });
    expect(res1.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res1.body.items).toHaveLength(2);

    const res2 = await getPostsForBlog(blog.body.id, { pageNumber: 2, pageSize: 2 });
    expect(res2.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res2.body.items).toHaveLength(2);

    const res3 = await getPostsForBlog(blog.body.id, { pageNumber: 3, pageSize: 2 });
    expect(res3.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res3.body.items).toHaveLength(1);
  });

  test('should sort posts by createdAt in ascending and descending order', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({ name: 'Blog Sorting' }), true);
    testBlogIds.push(blog.body.id);

    const post1 = await createTestPost(getCreatePostPayload(blog.body.id)({ title: 'First Post', content: 'First content' }), true);
    const post2 = await createTestPost(getCreatePostPayload(blog.body.id)({ title: 'Second Post', content: 'Second content' }), true);
    const post3 = await createTestPost(getCreatePostPayload(blog.body.id)({ title: 'Third Post', content: 'Third content' }), true);
    
    testPostIds.push(post1.body.id, post2.body.id, post3.body.id);
    
    const resAsc = await getPostsForBlog(blog.body.id, { sortBy: 'createdAt', sortDirection: 'asc' });
    expect(resAsc.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(resAsc.body.items[0].title).toBe('First Post');
    expect(resAsc.body.items[1].title).toBe('Second Post');
    expect(resAsc.body.items[2].title).toBe('Third Post');

    const resDesc = await getPostsForBlog(blog.body.id, { sortBy: 'createdAt', sortDirection: 'desc' });
    expect(resDesc.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(resDesc.body.items[0].title).toBe('Third Post');
    expect(resDesc.body.items[1].title).toBe('Second Post');
    expect(resDesc.body.items[2].title).toBe('First Post');
  });

  test('should handle invalid pagination parameters gracefully', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({ name: 'Blog Pagination' }), true);
    testBlogIds.push(blog.body.id);

    const post = await createTestPost(getCreatePostPayload(blog.body.id)({ title: 'Test Post', content: 'Test content' }), true);
    testPostIds.push(post.body.id);

    // @ts-ignore
    const res = await getPostsForBlog(blog.body.id, { pageNumber: 'invalid', pageSize: 'invalid' });

    // Expecting a 400 Bad Request if validation fails, or 200 if defaults apply
    expect([HTTP_STATUS_CODES.BAD_REQUEST_400, HTTP_STATUS_CODES.SUCCESS_200]).toContain(res.status);

    if (res.status === HTTP_STATUS_CODES.SUCCESS_200) {
      // If using defaults, expect page 1 and pageSize 10
      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(10);
    }
  });

  test('should handle non-existent blog with 404 error', async () => {
    const nonExistentBlogId = new ObjectId();

    const res = await getPostsForBlog(nonExistentBlogId);
    expect(res.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);

    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(res.body).toEqual(error);
  });

  test('should return empty list if no posts exist for a valid blog', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({ name: 'Empty Blog' }), true);
    testBlogIds.push(blog.body.id);

    const res = await getPostsForBlog(blog.body.id);
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items).toHaveLength(0);
  });
});
