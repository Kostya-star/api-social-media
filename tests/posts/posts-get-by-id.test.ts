import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { PostsErrorsList } from '../../src/errors/posts-errors';
import { IErrorItem } from '../../src/types/error-item';
import { createTestPost, deleteTestPost, getCreatePostPayload, getTestPostById } from './helpers';
import { createTestBlog, deleteTestBlog, getCreateBlogPayload } from '../blogs/helpers';
import { ObjectId } from 'mongodb';
describe('POSTS GET BY ID request', () => {
  let testBlogId: ObjectId | null;
  let testPostId: ObjectId | null;

  beforeAll(async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    const blogId = blog.body._id;
    testBlogId = blogId;
    const post = await createTestPost(getCreatePostPayload(blogId)({}), true);
    testPostId = post.body._id;
  });

  afterAll(async () => {
    await deleteTestBlog(testBlogId!, true);
    await deleteTestPost(testPostId!, true);
  });

  test('status check', async () => {
    const post = await getTestPostById(testPostId!);

    expect(post.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
  });
  test('status check with wrong postId', async () => {
    // @ts-ignore
    const post = await getTestPostById('123456hbgfdfdasfaopjadodviuseffne');
    expect(post.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);

    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: PostsErrorsList.NOT_FOUND };
    expect(post.body).toEqual(error);
  });
  test('response check', async () => {
    const post = await getTestPostById(testPostId!);

    expect(post.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);

    expect(post.body).toHaveProperty('_id');
    expect(post.body).toHaveProperty('title');
    expect(post.body).toHaveProperty('shortDescription');
    expect(post.body).toHaveProperty('content');
    expect(post.body).toHaveProperty('blogId');
    expect(post.body).toHaveProperty('blogName');
    expect(post.body).toHaveProperty('createdAt');
  });
});
