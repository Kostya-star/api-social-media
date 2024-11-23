import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { CommentsErrorsList } from '../../src/errors/comments-errors';
import { ObjectId } from 'mongodb';
import { baseUser, createTestUser, deleteTestUser } from '../users/helpers';
import { loginUser } from '../auth/helpers';
import { createTestPost, deleteTestPost, getCreatePostPayload } from '../posts/helpers';
import { createCommentForPost, getCommentById } from './helpers';
import { createTestBlog, getCreateBlogPayload, deleteTestBlog } from '../blogs/helpers';

let testUserId: ObjectId | null;
let testUserLogin: string | null;
let accessToken: string | null;
let testPostId: ObjectId | null;
let testCommentId: ObjectId | null;
let testBlogId: ObjectId | null;

const commBody = { content: 'Some random test comment content' }

describe('GET request to retrieve a comment by ID /comments/:commentId', () => {
  beforeAll(async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;
    testUserLogin = user.body.login;

    const loginResponse = await loginUser({ loginOrEmail: baseUser.email, password: baseUser.password });
    accessToken = loginResponse.body.accessToken;

    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body.id;

    const post = await createTestPost(getCreatePostPayload(testBlogId!)({}), true);
    testPostId = post.body.id;

    const comment = await createCommentForPost(testPostId!, commBody , accessToken!);
    testCommentId = comment.body.id;
  });

  afterAll(async () => {
    // if (testCommentId) {
    //   await deleteTestComment(testCommentId, true);
    //   testCommentId = null;
    // }

    if (testPostId) {
      await deleteTestPost(testPostId, true);
      testPostId = null;
    }

    if (testBlogId) {
      await deleteTestBlog(testBlogId, true);
      testBlogId = null;
    }

    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }
  });

  test('Successful retrieval of a comment by valid ID', async () => {
    const response = await getCommentById(testCommentId!);

    expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(response.body).not.toHaveProperty('_id', testCommentId);
    expect(response.body).toHaveProperty('id', testCommentId);
    expect(response.body).toHaveProperty('content', commBody.content);
    expect(response.body).not.toHaveProperty('postId');
    expect(response.body.commentatorInfo).toHaveProperty('userId', testUserId);
    expect(response.body.commentatorInfo).toHaveProperty('userLogin', testUserLogin);
    expect(response.body).toHaveProperty('createdAt');
  });

  test('Failed retrieval for non-existent commentId = 404', async () => {
    const nonExistentCommentId = new ObjectId();
    const response = await getCommentById(nonExistentCommentId);

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const error = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: CommentsErrorsList.NOT_FOUND };
    expect(response.body).toEqual(error);
  });

  test('Failed retrieval with invalid commentId format = 404', async () => {
    const invalidCommentId = 'invalid_id';
    // @ts-ignore
    const response = await getCommentById(invalidCommentId);

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const error = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: CommentsErrorsList.NOT_FOUND };
    expect(response.body).toEqual(error);
  });
});
