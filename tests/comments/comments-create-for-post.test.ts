import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { AuthErrorsList } from '../../src/errors/auth-errors';
import { CommentsErrorsList } from '../../src/errors/comments-errors';
import { PostsErrorsList } from '../../src/errors/posts-errors';
import { baseUser, createTestUser, deleteTestUser } from '../users/helpers';
import { loginUser } from '../auth/helpers';
import { createTestPost, deleteTestPost, getCreatePostPayload } from '../posts/helpers';
import { ObjectId } from 'mongodb';
import { createCommentForPost } from './helpers';
import { HTTP_ERROR_MESSAGES } from '../../src/const/http-error-messages';
import jwt from 'jsonwebtoken';
import { createTestBlog, getCreateBlogPayload, deleteTestBlog } from '../blogs/helpers';
import { ICommentBody } from '../../src/types/comments/commentBody';
import { IErrorItem } from '../../src/types/error-item';

let testUserId: ObjectId | null;
let testUserLogin: ObjectId | null;
let testPostId: ObjectId | null;
let testBlogId: ObjectId | null;
let accessToken: string | null;

const commBody: ICommentBody = { content: 'Valid comment content' }

describe('POST req for creating a comment for a post posts/:postId/comments', () => {
  beforeAll(async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;
    testUserLogin = user.body.login;
    
    const loginResponse = await loginUser({ loginOrEmail: baseUser.email, password: baseUser.password });
    accessToken = loginResponse.body.accessToken;
    
    const blog = await createTestBlog(getCreateBlogPayload({}), true)
    testBlogId = blog.body.id;

    const post = await createTestPost(getCreatePostPayload(testBlogId!)({}), true);
    testPostId = post.body.id;
  });

  afterAll(async () => {
    if (testPostId) {
      await deleteTestPost(testPostId, true);
      testPostId = null;
    }

    if (testUserId) {
      await deleteTestUser(testUserId, true);
      testUserId = null;
    }

    if (testBlogId) {
      await deleteTestBlog(testBlogId, true)
      testBlogId = null;
    }
  });

  test('Successful comment creation with valid token = 201', async () => {
    const response = await createCommentForPost(testPostId!, commBody, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('_id');
    expect(response.body).toHaveProperty('content', commBody.content);
    expect(response.body).not.toHaveProperty('postId', testPostId);
    expect(response.body.commentatorInfo).toHaveProperty('userId', testUserId);
    expect(response.body.commentatorInfo).toHaveProperty('userLogin', testUserLogin);
    expect(response.body).toHaveProperty('createdAt');
  });

  // Authorization Tests
  test('Failed comment creation without token = 401', async () => {
    const response = await createCommentForPost(testPostId!, commBody, '');

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });

  test('Failed comment creation with invalid token = 401', async () => {
    const response = await createCommentForPost(testPostId!, commBody, 'invalid_token');

    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    const error = { status: HTTP_STATUS_CODES.UNAUTHORIZED_401, message: HTTP_ERROR_MESSAGES.UNAUTHORIZED_401 };
    expect(response.body).toEqual(error);
  });

  test('Failed comment creation with unexisted postId = 404', async () => {
    const nonExistentPostId = new ObjectId();

    const response = await createCommentForPost(nonExistentPostId, commBody, accessToken!);

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: PostsErrorsList.NOT_FOUND };
    expect(response.body).toEqual(error);
  });


  // Input Validation Tests
  const validationTests = [
    {
      name: 'Should return 400 if content is too short',
      content: '12',
      expectedMessage: CommentsErrorsList.CONTENT_TOO_SHORT,
    },
    {
      name: 'Should return 400 if content is too long',
      content: 'a'.repeat(500),
      expectedMessage: CommentsErrorsList.CONTENT_TOO_BIG,
    },
    {
      name: 'Should return 400 if content is not a string',
      content: 12345,
      expectedMessage: CommentsErrorsList.CONTENT_NOT_STRING,
    },
  ];

  validationTests.forEach(({ name, content, expectedMessage }) => {
    test(name, async () => {
      // @ts-ignore
      const response = await createCommentForPost(testPostId!, { content }, accessToken);

      expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(response.body.errorsMessages).toContainEqual({
        field: 'content',
        message: expectedMessage,
      });
    });
  });
});
