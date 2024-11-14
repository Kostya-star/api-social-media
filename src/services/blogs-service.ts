import { IBlog } from '@/types/blogs/blog';
import { ErrorService } from './error-service';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { blogsCollection } from '@/DB';
import { ObjectId } from 'mongodb';
import BlogsRepository from '@/repositories/blogs-repository';

const getAllBlogs = async (): Promise<IBlog[]> => {
  return await BlogsRepository.getAllBlogs();
};

const getBlogById = async (blogId: string): Promise<IBlog> => {
  return await BlogsRepository.getBlogById(blogId);
};

const createBlog = async (blog: ICreateBlogPayload): Promise<IBlog> => {
  return await BlogsRepository.createBlog(blog);
};

const updateBlog = async (blogId: string, newBlog: IUpdateBlogPayload): Promise<void> => {
  return await BlogsRepository.updateBlog(blogId, newBlog);
};

const deleteBlog = async (blogId: string): Promise<void> => {
  return await BlogsRepository.deleteBlog(blogId);
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
