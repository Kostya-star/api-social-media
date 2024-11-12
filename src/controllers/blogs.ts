import { NextFunction, Request, Response } from 'express';
import BlogsService from '@/services/blogs-service';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';

const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await BlogsService.getAllBlogs();

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blogs);
  } catch (err) {
    next(err);
  }
};

// const getBlogById = (req: Request<{ blogId: string }>, res: Response, next: NextFunction) => {
//   const { blogId } = req.params; 
//   try {
//     const blog = BlogsService.getBlogById(blogId);

//     res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blog);
//   } catch (err) {
//     next(err);
//   }
// };

const createBlog = async (req: Request<any, any, ICreateBlogPayload>, res: Response, next: NextFunction) => {
  const newBlog = req.body;

  try {
    const blog = await BlogsService.createBlog(newBlog);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(blog);
  } catch (err) {
    next(err);
  }
};

// const updateBlog = (req: Request<{ blogId: string }, any, IUpdateBlogPayload>, res: Response, next: NextFunction) => {
//   const blogId = req.params.blogId;
//   const newBlog = req.body;

//   try {
//     BlogsService.updateBlog(blogId, newBlog);

//     res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
//   } catch (err) {
//     next(err);
//   }
// };

// const deleteBlog = (req: Request<{ blogId: string }>, res: Response, next: NextFunction) => {
//   const blogId = req.params.blogId;

//   try {
//     BlogsService.deleteBlog(blogId);

//     res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
//   } catch (err) {
//     next(err);
//   }
// };

export default {
  getAllBlogs,
  // getBlogById,
  createBlog,
  // updateBlog,
  // deleteBlog
};
