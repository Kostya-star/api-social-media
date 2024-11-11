import { APP_ROUTES } from '../../src/settings/routing';
import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';
import { BlogsErrorsList } from '../../src/errors/blogs-errors';
import { checkWrongValidation, createTestBlog, deleteTestBlog, getTestBlogById, updateBlogBody, updateTestBlog } from './helpers';
import { IErrorItem } from '../../src/types/error-item';

let testBlogId: string | null;

describe('BLOGS UPDATE BY ID request', () => {
  beforeEach(async () => await _beforeEach());

  afterEach(async () => await _afterEach());

  test('status check with auth = 204', async () => {
    const blog = await updateTestBlog(testBlogId!, true);

    expect(blog.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);
  });
  test('status check with NO auth = 401', async () => {
    const blog = await updateTestBlog(testBlogId!, false);

    expect(blog.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  });
  test('status check = 404', async () => {
    const blog = await updateTestBlog('qwefgdfvl,mjohn812ne32r829rf', true);

    expect(blog.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);

    const error: IErrorItem = { status: HTTP_STATUS_CODES.NOT_FOUND_404, message: BlogsErrorsList.NOT_FOUND };
    expect(blog.body).toEqual(error);
  });
  test('response check', async () => {
    const blog = await updateTestBlog(testBlogId!, true);

    expect(blog.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const updatedBlog = await getTestBlogById(testBlogId!);

    expect(updatedBlog.body).toMatchObject(updateBlogBody);
    expect(updatedBlog.body).toHaveProperty('name', updateBlogBody.name);
    expect(updatedBlog.body).toHaveProperty('description', updateBlogBody.description);
    expect(updatedBlog.body).toHaveProperty('websiteUrl', updateBlogBody.websiteUrl);
  });

  describe('CHECK VALIDATION', () => {
    beforeEach(async () => await _beforeEach());

    afterEach(async () => await _afterEach());

    const updateBlogReqUrl = `${APP_ROUTES.BLOGS}/${testBlogId}`;

    checkWrongValidation('name not specified', 'put', updateBlogReqUrl, { ...updateBlogBody, name: '' }, [
      { field: 'name', message: BlogsErrorsList.NAME_EMPTY },
    ]);
    checkWrongValidation('name wrong format', 'put', updateBlogReqUrl, { ...updateBlogBody, name: 55 }, [
      { field: 'name', message: BlogsErrorsList.NAME_WRONG_FORMAT },
    ]);
    checkWrongValidation('name too long', 'put', updateBlogReqUrl, { ...updateBlogBody, name: 'a'.repeat(20) }, [
      { field: 'name', message: BlogsErrorsList.NAME_EXCEEDED_LENGTH },
    ]);

    checkWrongValidation('description not specified', 'put', updateBlogReqUrl, { ...updateBlogBody, description: '' }, [
      { field: 'description', message: BlogsErrorsList.DESCRIPTION_EMPTY },
    ]);
    checkWrongValidation('description wrong format', 'put', updateBlogReqUrl, { ...updateBlogBody, description: null }, [
      { field: 'description', message: BlogsErrorsList.DESCRIPTION_WRONG_FORMAT },
    ]);
    checkWrongValidation('description too long', 'put', updateBlogReqUrl, { ...updateBlogBody, description: 'a'.repeat(501) }, [
      { field: 'description', message: BlogsErrorsList.DESCRIPTION_EXCEEDED_LENGTH },
    ]);

    checkWrongValidation('websiteUrl not specified', 'put', updateBlogReqUrl, { ...updateBlogBody, websiteUrl: '' }, [
      { field: 'websiteUrl', message: BlogsErrorsList.URL_EMPTY },
    ]);
    checkWrongValidation('websiteUrl wrong format', 'put', updateBlogReqUrl, { ...updateBlogBody, websiteUrl: 221 }, [
      { field: 'websiteUrl', message: BlogsErrorsList.URL_WRONG_FORMAT },
    ]);
    checkWrongValidation('websiteUrl invalid', 'put', updateBlogReqUrl, { ...updateBlogBody, websiteUrl: 'edfsfddsf' }, [
      { field: 'websiteUrl', message: BlogsErrorsList.URL_INVALID },
    ]);
  });
});

async function _beforeEach() {
  const res = await createTestBlog(true);
  testBlogId = res.body.id;
}

async function _afterEach() {
  if (testBlogId) {
    await deleteTestBlog(testBlogId, true);
    testBlogId = null;
  }
}
