import { IBlog } from '@/types/blogs/blog';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { ObjectId, Sort } from 'mongodb';
import BlogsRepository from '@/repositories/blogs-repository';
import { ErrorService } from './error-service';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';

const createBlog = async (blog: ICreateBlogPayload): Promise<IBlog> => {
  const newBlog: IBlog = { ...blog, isMembership: false, createdAt: new Date() };
  return await BlogsRepository.createBlog(newBlog);
};

const updateBlog = async (blogId: ObjectId, newBlog: IUpdateBlogPayload): Promise<void> => {
  if (!ObjectId.isValid(blogId)) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const blogToUpdate = await BlogsRepository.getBlogById(blogId);

  if (!blogToUpdate) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await BlogsRepository.updateBlog(blogId, newBlog);
};

const deleteBlog = async (blogId: ObjectId): Promise<void> => {
  if (!ObjectId.isValid(blogId)) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const blogToDelete = await BlogsRepository.getBlogById(blogId);

  if (!blogToDelete) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await BlogsRepository.deleteBlog(blogId);
};

export default {
  createBlog,
  updateBlog,
  deleteBlog,
};
