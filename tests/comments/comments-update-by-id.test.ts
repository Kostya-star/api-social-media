import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { CommentsErrorsList } from '../../src/errors/comments-errors';
import { ObjectId } from 'mongodb';
import { baseUser, createTestUser, deleteTestUser } from '../users/helpers';
import { loginUser } from '../auth/helpers';
import { createTestPost, deleteTestPost, getCreatePostPayload } from '../posts/helpers';
import { createCommentForPost, updateComment, getCommentById } from './helpers';
import { createTestBlog, getCreateBlogPayload, deleteTestBlog } from '../blogs/helpers';

let testUserId: ObjectId | null;
let anotherUserId: ObjectId | null;
let accessToken: string | null;
let anotherAccessToken: string | null;
let testPostId: ObjectId | null;
let testCommentId: ObjectId | null;
let testBlogId: ObjectId | null;

const updateCommBody = { content: 'some random updated comment' }

describe('PUT request to update a comment /comments/:commentId', () => {
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

    const comment = await createCommentForPost(testPostId!, { content: 'some random original comment content' }, accessToken!);
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

    if (anotherUserId) {
      await deleteTestUser(anotherUserId, true);
      anotherUserId = null;
    }
  });

  test('Successful update of a comment by owner', async () => {
    const response = await updateComment(testCommentId!, updateCommBody, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const verifyResponse = await getCommentById(testCommentId!);
    expect(verifyResponse.body).toHaveProperty('content', updateCommBody.content);
  });

  test('Unauthorized update with no Authorization header', async () => {
    const response = await updateComment(testCommentId!, updateCommBody, '');

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });

  test('Unauthorized update with malformed Authorization header', async () => {
    const response = await updateComment(testCommentId!, updateCommBody, 'MalformedToken');

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });

  test('Failed update when content is too short = 400', async () => {
    const updatedContent = { content: 'Hi' };
    const response = await updateComment(testCommentId!, updatedContent, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
    // expect(response.body.errorsMessages[0].field).toBe('content');
    expect(response.body.errorsMessages).toContainEqual({
      field: 'content',
      message: CommentsErrorsList.CONTENT_TOO_SHORT,
    });
  });

  test('Forbidden update by non-owner = 403', async () => {
    const updatedContent = { content: 'Update by another user' };
    const response = await updateComment(testCommentId!, updatedContent, anotherAccessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.FORBIDDEN_403);
  });

  test('Failed update for non-existent commentId = 404', async () => {
    const nonExistentCommentId = new ObjectId();
    const response = await updateComment(nonExistentCommentId, updateCommBody, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });

  test('Failed update with invalid commentId format = 404', async () => {
    const invalidCommentId = 'invalid_id';
    // @ts-ignore
    const response = await updateComment(invalidCommentId, updateCommBody, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });
});
