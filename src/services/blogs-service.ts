import { IBlog } from '@/types/blogs/blog';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { ObjectId } from 'mongodb';
import BlogsRepository from '@/repositories/blogs-repository';

const getAllBlogs = async (): Promise<IBlog[]> => {
  return await BlogsRepository.getAllBlogs();
};

const getBlogById = async (blogId: ObjectId): Promise<IBlog> => {
  return await BlogsRepository.getBlogById(blogId);
};

const createBlog = async (blog: ICreateBlogPayload): Promise<IBlog> => {
  return await BlogsRepository.createBlog(blog);
};

const updateBlog = async (blogId: ObjectId, newBlog: IUpdateBlogPayload): Promise<void> => {
  return await BlogsRepository.updateBlog(blogId, newBlog);
};

const deleteBlog = async (blogId: ObjectId): Promise<void> => {
  return await BlogsRepository.deleteBlog(blogId);
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
