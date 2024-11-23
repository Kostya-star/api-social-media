import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { CommentsErrorsList } from '../../src/errors/comments-errors';
import { ObjectId } from 'mongodb';
import { baseUser, createTestUser, deleteTestUser } from '../users/helpers';
import { loginUser } from '../auth/helpers';
import { createTestPost, deleteTestPost, getCreatePostPayload } from '../posts/helpers';
import { createCommentForPost, deleteComment, getCommentById } from './helpers';
import { createTestBlog, getCreateBlogPayload, deleteTestBlog } from '../blogs/helpers';

let testUserId: ObjectId | null;
let anotherUserId: ObjectId | null;
let accessToken: string | null;
let anotherAccessToken: string | null;
let testPostId: ObjectId | null;
let testCommentId: ObjectId | null;
let testBlogId: ObjectId | null;

describe('DELETE request to delete a comment /comments/:commentId', () => {
  beforeAll(async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;

    const anotherUser = await createTestUser({ email: 'anotheruser@example.com', login: 'User5', password: 'password' }, true);
    anotherUserId = anotherUser.body.id;

    const loginResponse = await loginUser({ loginOrEmail: baseUser.email, password: baseUser.password });
    accessToken = loginResponse.body.accessToken;

    const anotherLoginResponse = await loginUser({ loginOrEmail: 'anotheruser@example.com', password: 'password' });
    anotherAccessToken = anotherLoginResponse.body.accessToken;

    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body.id;

    const post = await createTestPost(getCreatePostPayload(testBlogId!)({}), true);
    testPostId = post.body.id;

    const comment = await createCommentForPost(testPostId!, { content: 'some comment to delete' }, accessToken!);
    testCommentId = comment.body.id;
  });

  afterAll(async () => {
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

    if (anotherUserId) {
      await deleteTestUser(anotherUserId, true);
      anotherUserId = null;
    }
  });

  test('Forbidden deletion by non-owner = 403', async () => {
    const response = await deleteComment(testCommentId!, anotherAccessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.FORBIDDEN_403);
  });

  test('Successful deletion of a comment by owner', async () => {
    const response = await deleteComment(testCommentId!, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    // Verify the comment no longer exists
    const verifyResponse = await getCommentById(testCommentId!);
    expect(verifyResponse.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });

  test('Unauthorized deletion with no Authorization header', async () => {
    const response = await deleteComment(testCommentId!, '');

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });

  test('Unauthorized deletion with malformed Authorization header', async () => {
    const response = await deleteComment(testCommentId!, 'MalformedToken');

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });

  test('Failed deletion for non-existent commentId = 404', async () => {
    const nonExistentCommentId = new ObjectId();
    const response = await deleteComment(nonExistentCommentId, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });

  test('Failed deletion with invalid commentId format = 404', async () => {
    const invalidCommentId = 'invalid_id';
    // @ts-ignore
    const response = await deleteComment(invalidCommentId, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });
});
