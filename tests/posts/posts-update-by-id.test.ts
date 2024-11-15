import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { createTestBlog, deleteTestBlog, getCreateBlogPayload } from '../blogs/helpers';
import { IErrorItem } from '../../src/types/error-item';
import { createTestPost, deleteTestPost, getCreatePostPayload, getTestPostById, updateTestPost } from './helpers';
import { PostsErrorsList } from '../../src/errors/posts-errors';
import { IUpdatePostBody } from '../../src/types/posts/updatePostBody';
import { CONTENT_MAX_LENGTH, TITLE_MAX_LENGTH } from '../../src/const/posts/posts';
import { ObjectId } from 'mongodb';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';

let testBlogId: ObjectId | null;
let testPostId: ObjectId | null;

describe('POSTS UPDATE BY ID request', () => {
  beforeAll(async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body.id;
  });

  afterAll(async () => {
    // if (testBlogId) {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
    // }
  });
  
  beforeEach(async () => {
    const post = await createTestPost(getCreatePostPayload(testBlogId!)({}), true);
    testPostId = post.body.id;
  });
  
  afterEach(async () => {
    // if (testPostId) {
      await deleteTestPost(testPostId!, true);
      testPostId = null;
    // }
  });

  test('status check with auth = 204', async () => {
    const post = await updateTestPost(testPostId!, getUpdatePostPayload({}), true);
    
    expect(post.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
  });
  test('status check with NO auth = 401', async () => {
    const post = await updateTestPost(testPostId!, getUpdatePostPayload({}), false);

    expect(post.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('status check = 404', async () => {
    // @ts-ignore
    const post = await updateTestPost('qwefgdfvl,mjohn812ne32r829rf', getUpdatePostPayload({}), true);

    expect(post.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);

    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: PostsErrorsList.NOT_FOUND };
    expect(post.body).toEqual(error);
  });
  test('response check', async () => {
    const post = await updateTestPost(testPostId!, getUpdatePostPayload({}), true);

    expect(post.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const updatedPost = await getTestPostById(testPostId!);

    expect(updatedPost.body).toMatchObject(getUpdatePostPayload({}));
    expect(updatedPost.body).toHaveProperty('title', getUpdatePostPayload({}).title);
    expect(updatedPost.body).toHaveProperty('shortDescription', getUpdatePostPayload({}).shortDescription);
    expect(updatedPost.body).toHaveProperty('content', getUpdatePostPayload({}).content);
    expect(updatedPost.body).toHaveProperty('blogId', getUpdatePostPayload({}).blogId);
    expect(updatedPost.body).toHaveProperty('createdAt');
  });
});

describe('CHECK VALIDATION for POSTS update /put request', () => {
  beforeAll(async () => {
    const blog = await createTestBlog(getCreateBlogPayload({}), true);
    testBlogId = blog.body.id;
  });

  afterAll(async () => {
    // if (testBlogId) {
      await deleteTestBlog(testBlogId!, true);
      testBlogId = null;
    // }
  });

  beforeEach(async () => {
    const post = await createTestPost(getCreatePostPayload(testBlogId!)({}), true);
    testPostId = post.body.id;
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
      payload: getUpdatePostPayload({ title: '' }),
      expectedField: 'title',
      expectedMessage: PostsErrorsList.TITLE_EMPTY,
    },
    {
      name: 'Should return 400 if title is not trimmed',
      payload: getUpdatePostPayload({ title: '   ' }),
      expectedField: 'title',
      expectedMessage: PostsErrorsList.TITLE_EMPTY,
    },
    {
      name: 'Should return 400 if title is not a string',
      // @ts-ignore
      payload: getUpdatePostPayload({ title: 123 }),
      expectedField: 'title',
      expectedMessage: PostsErrorsList.TITLE_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if title exceeds max length',
      payload: getUpdatePostPayload({ title: 'a'.repeat(TITLE_MAX_LENGTH + 1) }),
      expectedField: 'title',
      expectedMessage: PostsErrorsList.TITLE_EXCEEDED_LENGTH,
    },
    {
      name: 'Should return 400 if shortDescription is missing',
      payload: getUpdatePostPayload({ shortDescription: '' }),
      expectedField: 'shortDescription',
      expectedMessage: PostsErrorsList.SHORT_DESCRIPTION_EMPTY,
    },
    {
      name: 'Should return 400 if shortDescription is not trimmed',
      payload: getUpdatePostPayload({ shortDescription: '   ' }),
      expectedField: 'shortDescription',
      expectedMessage: PostsErrorsList.SHORT_DESCRIPTION_EMPTY,
    },
    {
      name: 'Should return 400 if shortDescription is not a string',
      // @ts-ignore
      payload: getUpdatePostPayload({ shortDescription: null }),
      expectedField: 'shortDescription',
      expectedMessage: PostsErrorsList.SHORT_DESCRIPTION_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if content is missing',
      payload: getUpdatePostPayload({ content: '' }),
      expectedField: 'content',
      expectedMessage: PostsErrorsList.CONTENT_EMPTY,
    },
    {
      name: 'Should return 400 if content is not trimmed',
      payload: getUpdatePostPayload({ content: '    ' }),
      expectedField: 'content',
      expectedMessage: PostsErrorsList.CONTENT_EMPTY,
    },
    {
      name: 'Should return 400 if content exceeds max length',
      payload: getUpdatePostPayload({ content: 'a'.repeat(CONTENT_MAX_LENGTH + 1) }),
      expectedField: 'content',
      expectedMessage: PostsErrorsList.CONTENT_EXCEEDED_LENGTH,
    },
    {
      name: 'Should return 400 if blogId is not specified',
      // @ts-ignore
      payload: getUpdatePostPayload({ blogId: '' }),
      expectedField: 'blogId',
      expectedMessage: PostsErrorsList.BLOG_ID_EMPTY,
    },
    {
      name: 'Should return 400 if blogId is not not trimmed',
      // @ts-ignore
      payload: getUpdatePostPayload({ blogId: '   ' }),
      expectedField: 'blogId',
      expectedMessage: PostsErrorsList.BLOG_ID_EMPTY,
    },
    {
      name: 'Should return 400 if blogId is not a string',
      // @ts-ignore`
      payload: getUpdatePostPayload({ blogId: 123 }),
      expectedField: 'blogId',
      expectedMessage: PostsErrorsList.BLOG_ID_WRONG_FORMAT,
    },
    {
      name: 'Should return 400 if blogId does not exist',
      // @ts-ignore
      payload: getUpdatePostPayload({ blogId: 'nonexistentBlogId' }),
      expectedField: 'blogId',
      expectedMessage: BlogsErrorsList.NOT_FOUND,
    },
  ];

  tests.forEach(({ name, payload, expectedField, expectedMessage }) => {
    test(name, async () => {
      const post = await updateTestPost(testPostId!, payload, true);
      expect(post.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
      expect(post.body.errorsMessages).toContainEqual({
        field: expectedField,
        message: expectedMessage,
      });
    });
  });
});

function getUpdatePostPayload({
  title = 'Updated post title',
  shortDescription = 'Updated post short description',
  content = 'Updated post content',
  blogId = testBlogId!,
}: Partial<IUpdatePostBody>): IUpdatePostBody {
  return {
    title,
    shortDescription,
    content,
    blogId,
  };
};