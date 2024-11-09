import { NextFunction, Request, Response } from 'express';
import BlogsService from '@/services/blogs-service';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';

const getAllBlogs = (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = BlogsService.getAllBlogs();

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blogs);
  } catch (err) {
    next(err);
  }
};

const getBlogById = (req: Request<{ blogId: string }>, res: Response, next: NextFunction) => {
  const { blogId } = req.params; 
  try {
    const blog = BlogsService.getBlogById(blogId);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blog);
  } catch (err) {
    next(err);
  }
};

const createBlog = (req: Request<any, any, ICreateBlogPayload>, res: Response, next: NextFunction) => {
  const newBlog = req.body;

  try {
    const blog = BlogsService.createBlog(newBlog);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(blog);
  } catch (err) {
    next(err);
  }
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog
};
