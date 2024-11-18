import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { APP_ROUTES } from '../../src/routing';
import { req } from '../helper';
import { createTestBlog, deleteTestBlog, getAllBlogs, getCreateBlogPayload } from './helpers';
import { ObjectId } from 'mongodb';

let testBlogIds: ObjectId[] = [];

describe('BLOGS GET ALL request', () => {
  beforeEach(async () => {
    await req.delete(APP_ROUTES.TESTING).set('Accept', 'application/json');
  });

  afterEach(async () => {
    for (const blogId of testBlogIds) {
      await deleteTestBlog(blogId, true);
    }
    testBlogIds = [];
  });

  test('status check', async () => {
    const res = await getAllBlogs();
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
  });

  test('should return a list of blogs', async () => {
    const blog1 = await createTestBlog(getCreateBlogPayload({ name: 'Blog 1' }), true);
    const blog2 = await createTestBlog(getCreateBlogPayload({ name: 'Blog 2' }), true);
    const blog3 = await createTestBlog(getCreateBlogPayload({ name: 'Blog 3' }), true);

    testBlogIds.push(blog1.body.id, blog2.body.id, blog3.body.id);

    const res = await getAllBlogs();

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items.length).toBeGreaterThanOrEqual(3);
  });

  test('should return paginated blogs with pageNumber and pageSize parameters', async () => {
    const blogsToCreate = 5;
    for (let i = 1; i <= blogsToCreate; i++) {
      const blog = await createTestBlog(getCreateBlogPayload({ name: `Blog ${i}` }), true);
      testBlogIds.push(blog.body.id);
    }

    const res1 = await getAllBlogs({ pageNumber: 1, pageSize: 2 });
    expect(res1.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res1.body.items).toHaveLength(2);

    const res2 = await getAllBlogs({ pageNumber: 2, pageSize: 2 });
    expect(res2.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res2.body.items).toHaveLength(2);

    const res3 = await getAllBlogs({ pageNumber: 3, pageSize: 2 });
    expect(res3.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res3.body.items).toHaveLength(1);
  });

  test('should sort blogs by createdAt in ascending and descending order', async () => {
    const blog1 = await createTestBlog(getCreateBlogPayload({ name: 'Blog A' }), true);
    const blog2 = await createTestBlog(getCreateBlogPayload({ name: 'Blog B' }), true);
    const blog3 = await createTestBlog(getCreateBlogPayload({ name: 'Blog C' }), true);

    testBlogIds.push(blog1.body.id, blog2.body.id, blog3.body.id);

    const resAsc = await getAllBlogs({ sortBy: 'createdAt', sortDirection: 'asc' });
    expect(resAsc.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(resAsc.body.items[0].name).toBe('Blog A');
    expect(resAsc.body.items[1].name).toBe('Blog B');
    expect(resAsc.body.items[2].name).toBe('Blog C');

    const resDesc = await getAllBlogs({ sortBy: 'createdAt', sortDirection: 'desc' });
    expect(resDesc.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(resDesc.body.items[0].name).toBe('Blog C');
    expect(resDesc.body.items[1].name).toBe('Blog B');
    expect(resDesc.body.items[2].name).toBe('Blog A');
  });

  test('should filter blogs by searchNameTerm', async () => {
    const blog1 = await createTestBlog(getCreateBlogPayload({ name: 'First Blog' }), true);
    const blog2 = await createTestBlog(getCreateBlogPayload({ name: 'Second Blog' }), true);
    const blog3 = await createTestBlog(getCreateBlogPayload({ name: 'Third Blog' }), true);

    testBlogIds.push(blog1.body.id, blog2.body.id, blog3.body.id);

    const res = await getAllBlogs({ searchNameTerm: 'Second' });
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe('Second Blog');
  });

  test('should handle search with no matching results', async () => {
    const blog1 = await createTestBlog(getCreateBlogPayload({ name: 'Alpha Blog' }), true);
    const blog2 = await createTestBlog(getCreateBlogPayload({ name: 'Beta Blog' }), true);

    testBlogIds.push(blog1.body.id, blog2.body.id);

    // Search by a non-existing term
    const res = await getAllBlogs({ searchNameTerm: 'NonExistent' });
    expect(res.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items).toHaveLength(0);
  });

  test('should handle invalid pagination parameters gracefully', async () => {
    const blog = await createTestBlog(getCreateBlogPayload({ name: 'Test Blog' }), true);
    testBlogIds.push(blog.body.id);

    // @ts-ignore
    const res = await getAllBlogs({ pageNumber: 'invalid', pageSize: 'invalid' });

    // Expecting a 400 Bad Request if validation fails, or 200 if defaults apply
    expect([HTTP_STATUS_CODES.BAD_REQUEST_400, HTTP_STATUS_CODES.SUCCESS_200]).toContain(res.status);

    if (res.status === HTTP_STATUS_CODES.SUCCESS_200) {
      // If using defaults, expect page 1 and pageSize 10
      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(10);
    }
  });
});
