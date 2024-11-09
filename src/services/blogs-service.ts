import { mockDB } from '@/mockDB';
import { IBlog } from '@/types/blogs/blog';
import { ErrorService } from './error-service';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { v4 as uuidv4 } from 'uuid';

const getAllBlogs = (): IBlog[] => {
  try {
    return mockDB.blogs;
  } catch (err) {
    throw err;
  }
};

const getBlogById = (blogId: string): IBlog => {
  try {
    const blog = mockDB.blogs.find((b) => b.id === blogId);

    if (!blog) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    return blog;
  } catch (err) {
    throw err;
  }
};

const createBlog = (blog: ICreateBlogPayload): IBlog => {
  const newBlog: IBlog = {
    id: uuidv4(),
    ...blog,
  };

  try {
    mockDB.blogs.push(newBlog);
    return newBlog;
  } catch (err) {
    throw err;
  }
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
};
