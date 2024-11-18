import { NextFunction, Request, Response } from 'express';
import BlogsService from '@/services/blogs-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { ObjectId } from 'mongodb';
import PostsService from '@/services/posts-service';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { ErrorService } from '@/services/error-service';
import { GetAllBlogsQuery } from '@/types/blogs/getAllBlogsQuery';

const getAllBlogs = async (req: Request<any, any, any, GetAllBlogsQuery>, res: Response, next: NextFunction) => {
  const searchNameTerm = req.query.searchNameTerm || null;
  const sortBy = req.query.sortBy || 'createdAt';
  const sortDirection = req.query.sortDirection || 'desc';
  const pageNumber = parseInt(String(req.query.pageNumber)) || 1;
  const pageSize = parseInt(String(req.query.pageSize)) || 10;

  try {
    const blogs = await BlogsService.getAllBlogs({ searchNameTerm, sortBy, sortDirection, pageNumber, pageSize });

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blogs);
  } catch (err) {
    next(err);
  }
};

const getBlogById = async (req: Request<{ blogId: ObjectId }>, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await BlogsService.getBlogById(blogId);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blog);
  } catch (err) {
    next(err);
  }
};

const createBlog = async (req: Request<any, any, ICreateBlogPayload>, res: Response, next: NextFunction) => {
  const newBlog = req.body;

  try {
    const blog = await BlogsService.createBlog(newBlog);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(blog);
  } catch (err) {
    next(err);
  }
};

const createPostForBlog = async (req: Request<{ blogId: ObjectId }, any, Omit<ICreatePostBody, 'blogId'>>, res: Response, next: NextFunction) => {
  const blogId = req.params.blogId;
  const newPost = { ...req.body, blogId };

  try {
    if (!ObjectId.isValid(blogId)) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blog = await BlogsService.getBlogById(blogId);

    if (!blog) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const createdBlog = await PostsService.createPost(newPost);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(createdBlog);
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req: Request<{ blogId: ObjectId }, any, IUpdateBlogPayload>, res: Response, next: NextFunction) => {
  const blogId = req.params.blogId;
  const newBlog = req.body;

  try {
    await BlogsService.updateBlog(blogId, newBlog);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req: Request<{ blogId: ObjectId }>, res: Response, next: NextFunction) => {
  const blogId = req.params.blogId;

  try {
    await BlogsService.deleteBlog(blogId);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  createPostForBlog,
  updateBlog,
  deleteBlog,
};
