import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { PostsErrorsList } from '../../src/errors/posts-errors';
import { baseUser, createTestUser, deleteTestUser } from '../users/helpers';
import { loginUser } from '../auth/helpers';
import { createTestPost, deleteTestPost, getCreatePostPayload } from '../posts/helpers';
import { ObjectId } from 'mongodb';
import { createCommentForPost, getCommentsForPost } from './helpers';
import { createTestBlog, getCreateBlogPayload, deleteTestBlog } from '../blogs/helpers';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../src/const/query-defaults';
import { SORT_DIRECTIONS } from '../../src/const/sort-directions';

let testUserId: ObjectId | null;
let accessToken: string | null;
let testPostId: ObjectId | null;
let testBlogId: ObjectId | null;

describe('GET request for retrieving comments for a post /posts/:postId/comments', () => {
  beforeAll(async () => {
    const user = await createTestUser(baseUser, true);
    testUserId = user.body.id;

    const loginResponse = await loginUser({ loginOrEmail: baseUser.email, password: baseUser.password });
    accessToken = loginResponse.body.accessToken;

    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body.id;

    const post = await createTestPost(getCreatePostPayload(testBlogId!)({}), true);
    testPostId = post.body.id;

    for (let i = 1; i <= 5; i++) {
      await createCommentForPost(testPostId!, { content: `Some kind of random comment content ${i}` }, accessToken!);
    }
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
  });

  test('Successful retrieval of comments with default pagination and sorting', async () => {
    const response = await getCommentsForPost(testPostId!, {});

    expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(response.body).toHaveProperty('items');
    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThan(0);

    // Check pagination details
    expect(response.body).toHaveProperty('pagesCount');
    expect(response.body).toHaveProperty('page', DEFAULT_PAGE_NUMBER);
    expect(response.body).toHaveProperty('pageSize', DEFAULT_PAGE_SIZE);
    expect(response.body).toHaveProperty('totalCount', 5); // Assuming 5 comments were created
  });

  test('Successful retrieval of comments with custom pagination', async () => {
    const response = await getCommentsForPost(testPostId!, { pageNumber: 1, pageSize: 2 });

    expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(response.body.items.length).toBe(2);
    expect(response.body.pageSize).toBe(2);
  });

  test('Successful retrieval with sorting by content (ASC)', async () => {
    const response = await getCommentsForPost(testPostId!, { sortBy: 'content', sortDirection: SORT_DIRECTIONS.ASC });

    expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS_200);
    expect(response.body.items[0].content).toBe(`Some kind of random comment content 1`);
  });

  test('Failed retrieval for non-existent postId = 404', async () => {
    const nonExistentPostId = new ObjectId();
    const response = await getCommentsForPost(nonExistentPostId, {});

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const error = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: PostsErrorsList.NOT_FOUND };
    expect(response.body).toEqual(error);
  });

  test('Failed retrieval with invalid postId format = 404', async () => {
    const invalidPostId = 'invalid_id';
    // @ts-ignore
    const response = await getCommentsForPost(invalidPostId, {});

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
    const error = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: PostsErrorsList.NOT_FOUND };
    expect(response.body).toEqual(error);
  });
});
