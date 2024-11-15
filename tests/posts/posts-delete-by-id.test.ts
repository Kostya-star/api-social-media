import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { createTestBlog, deleteTestBlog, getCreateBlogPayload } from '../blogs/helpers';
import { IErrorItem } from '../../src/types/error-item';
import { createTestPost, deleteTestPost, getCreatePostPayload, getTestPostById } from './helpers';
import { PostsErrorsList } from '../../src/errors/posts-errors';
import { ObjectId } from 'mongodb';

describe('POSTS DELETE BY ID request', () => {
  let testBlogId: ObjectId | null = null;
  let testPostId: ObjectId | null = null;

  beforeAll(async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body.id;
  });

  afterAll(async () => {
    // if(testBlogId) {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
    // }
  });
  
  beforeEach(async () => {
    const post = await createTestPost(getCreatePostPayload(testBlogId!)({}), true);
    testPostId = post.body.id;
  });
  
  afterEach(async () => {
    // if(testPostId) {
      await deleteTestPost(testPostId!, true);
      testPostId = null;
    // }
  });

  test('status check. should be 204', async () => {
    const res = await deleteTestPost(testPostId!, true);
    expect(res.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
  });
  test('status check. should be 401', async () => {
    const res = await deleteTestPost(testPostId!, false);

    expect(res.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('status check. should be 404 coz no post found', async () => {
    // @ts-ignore
    const res = await deleteTestPost('12345678utygewxr2e12e12211221qw', true);

    expect(res.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: PostsErrorsList.NOT_FOUND };
    expect(res.body).toEqual(error);
  });
  test('successful deletion. post is deleted from DB and cant be found anymore', async () => {
    const res =  await deleteTestPost(testPostId!, true);
    expect(res.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
    
    const post = await getTestPostById(testPostId!);
    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: PostsErrorsList.NOT_FOUND };
    expect(post.body).toEqual(error);
  });
});
