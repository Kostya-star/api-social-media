import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { createTestBlog, deleteTestBlog, getCreateBlogPayload } from '../blogs/helpers';
import { createTestPost, deleteTestPost, getCreatePostPayload } from './helpers';
import { PostsErrorsList } from '../../src/errors/posts-errors';
import { TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH } from '../..//src/const/posts/posts';
import { ObjectId } from 'mongodb';

let testBlogId: ObjectId | null;
let testPostId: ObjectId | null;

describe('POSTS CREATE request', () => {
  beforeAll(async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body._id;
  });

  afterAll(async () => {
    // if(testBlogId) {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
    // }
  });

  afterEach(async () => {
    // if (testPostId) {
      await deleteTestPost(testPostId!, true);
      testPostId = null;
    // }
  });

  test('status check with auth = 201', async () => {
    const post = await createTestPost(getCreatePostPayload(testBlogId!)({ blogId: testBlogId! }), true);
    testPostId = post.body._id;

    expect(post.headers['content-type']).toMatch(/json/);
    expect(post.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
  });
  test('status check with NO auth = 401', async () => {
    const post = await createTestPost(getCreatePostPayload(testBlogId!)({ blogId: testBlogId! }), false);
    testPostId = post.body._id;

    expect(post.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('response check', async () => {
    const post = await createTestPost(getCreatePostPayload(testBlogId!)({ blogId: testBlogId! }), true);
    testPostId = post.body._id;

    expect(post.status).toBe(HTTP_STATUS_CODES.SUCCESS_201);
    expect(post.body).toMatchObject(getCreatePostPayload(testBlogId!)({ blogId: testBlogId! }));
    // expect(mockDB.posts.length).toBeGreaterThan(0);
    expect(post.body).toHaveProperty('_id');
    expect(post.body).toHaveProperty('title');
    expect(post.body).toHaveProperty('shortDescription');
    expect(post.body).toHaveProperty('content');
    expect(post.body).toHaveProperty('blogId');
    expect(post.body).toHaveProperty('blogName');
  });
});

// VALIDATION
describe('POST /posts - Validation Tests', () => {
  beforeAll(async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body._id;
  });

  afterAll(async () => {
    // if (testBlogId) {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
    // } 
  });

  afterEach(async () => {
    // if (testPostId) {
      await deleteTestPost(testPostId!, true);
      testPostId = null;
    // }
  });

  const tests = [
    {
      name: 'Should return 400 if title is missing',
      payload: getCreatePostPayload(testBlogId!)({ title: '' }),
      expectedField: 'title',
      expectedMessage: PostsErrorsList.TITLE_EMPTY,
    },
    {
      name: 'Should return 400 if title is not trimmed',
      payload: getCreatePostPayload(testBlogId!)({ title: '   ' }),
      expectedField: 'title',
      expectedMessage: PostsErrorsList.TITLE_EMPTY,
    },
    {
      name: 'Should return 400 if title is not a string',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ title: 123 }),
      expectedField: 'title',
      expectedMessage: PostsErrorsList.TITLE_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if title exceeds max length',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ title: 'a'.repeat(TITLE_MAX_LENGTH + 1) }),
      expectedField: 'title',
      expectedMessage: PostsErrorsList.TITLE_EXCEEDED_LENGTH,
    },
    {
      name: 'Should return 400 if shortDescription is missing',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ shortDescription: '' }),
      expectedField: 'shortDescription',
      expectedMessage: PostsErrorsList.SHORT_DESCRIPTION_EMPTY,
    },
    {
      name: 'Should return 400 if shortDescription is not trimmed',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ shortDescription: '    ' }),
      expectedField: 'shortDescription',
      expectedMessage: PostsErrorsList.SHORT_DESCRIPTION_EMPTY,
    },
    {
      name: 'Should return 400 if shortDescription is not a string',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ shortDescription: null }),
      expectedField: 'shortDescription',
      expectedMessage: PostsErrorsList.SHORT_DESCRIPTION_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if content is missing',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ content: '' }),
      expectedField: 'content',
      expectedMessage: PostsErrorsList.CONTENT_EMPTY,
    },
    {
      name: 'Should return 400 if content is not trimmed',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ content: '   ' }),
      expectedField: 'content',
      expectedMessage: PostsErrorsList.CONTENT_EMPTY,
    },
    {
      name: 'Should return 400 if content exceeds max length',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ content: 'a'.repeat(CONTENT_MAX_LENGTH + 1) }),
      expectedField: 'content',
      expectedMessage: PostsErrorsList.CONTENT_EXCEEDED_LENGTH,
    },
    {
      name: 'Should return 400 if blogId is not specified',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ blogId: '' }),
      expectedField: 'blogId',
      expectedMessage: PostsErrorsList.BLOG_ID_EMPTY,
    },
    {
      name: 'Should return 400 if blogId is not trimmed',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ blogId: '   ' }),
      expectedField: 'blogId',
      expectedMessage: PostsErrorsList.BLOG_ID_EMPTY,
    },
    {
      name: 'Should return 400 if blogId is not a string',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ blogId: 123 }),
      expectedField: 'blogId',
      expectedMessage: PostsErrorsList.BLOG_ID_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if blogId does not exist',
      // @ts-ignore
      payload: getCreatePostPayload(testBlogId!)({ blogId: 'nonexistentBlogId' }),
      expectedField: 'blogId',
      expectedMessage: PostsErrorsList.BLOG_NOT_EXIST_WITH_ID,
    },
  ];

  tests.forEach(({ name, payload, expectedField, expectedMessage }) => {
    test(name, async () => {
      const post = await createTestPost(payload, true);
      testPostId = post.body._id;
      expect(post.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(post.body.errorsMessages).toContainEqual({
        field: expectedField,
        message: expectedMessage,
      });
    });
  });
});