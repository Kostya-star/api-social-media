import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { ObjectId } from 'mongodb';
import BlogsRepository from '@/repositories/blogs/blogs-repository-commands';
import { ErrorService } from './error-service';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IBlogDB } from '@/types/blogs/blog';
import { MongooseObjtId } from '@/types/mongoose-object-id';

const createBlog = async (blog: ICreateBlogPayload): Promise<MongooseObjtId> => {
  return await BlogsRepository.createBlog(blog);
};

const updateBlog = async (blogId: MongooseObjtId, newBlog: IUpdateBlogPayload): Promise<void> => {
  if (!ObjectId.isValid(blogId)) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const blogToUpdate = await BlogsRepository.getBlogById(blogId);

  if (!blogToUpdate) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await BlogsRepository.updateBlog(blogId, newBlog);
};

const deleteBlog = async (blogId: MongooseObjtId): Promise<void> => {
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
