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
import { IBaseQuery } from '@/types/base-query';
import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/const/query-defaults';
import BlogsRepository from '@/repositories/blogs-repository';
import { blogObjMapper } from '@/util/mappers/blogObjMapper';
import { IBaseResponse } from '@/types/base-response';
import PostsRepository from '@/repositories/posts-repository';
import { postObjMapper } from '@/util/mappers/postObjMapper';
import { IBlogView } from '@/types/blogs/blog';
import { IPostDB, IPostView } from '@/types/posts/post';

const getAllBlogs = async (req: Request<any, any, any, GetAllBlogsQuery>, res: Response<IBaseResponse<IBlogView>>, next: NextFunction) => {
  try {
    const searchNameTerm = req.query.searchNameTerm || null;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
    const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
    const _pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

    const { pagesCount, page, pageSize, totalCount, items } = await BlogsRepository.getAllBlogs({
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize: _pageSize,
    });

    const resp = { pagesCount, page, pageSize, totalCount, items: items.map(blogObjMapper) };

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
  } catch (err) {
    next(err);
  }
};

const getBlogById = async (req: Request<{ blogId: ObjectId }>, res: Response<IBlogView>, next: NextFunction) => {
  const { blogId } = req.params;

  try {
    if (!ObjectId.isValid(blogId)) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blog = await BlogsRepository.getBlogById(blogId);

    if (!blog) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blogObjMapper(blog));
  } catch (err) {
    next(err);
  }
};

const getPostsForBlog = async (
  req: Request<{ blogId: ObjectId }, any, any, IBaseQuery<IPostDB>>,
  res: Response<IBaseResponse<IPostView>>,
  next: NextFunction
) => {
  const { blogId } = req.params;

  try {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
    const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
    const _pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

    if (!ObjectId.isValid(blogId)) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blog = await BlogsRepository.getBlogById(blogId);

    if (!blog) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const { pagesCount, page, pageSize, totalCount, items } = await PostsRepository.getPostsForBlog(blogId, {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize: _pageSize,
    });

    const resp = { pagesCount, page, pageSize, totalCount, items: items.map(postObjMapper) };

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
  } catch (err) {
    next(err);
  }
};

const createBlog = async (req: Request<any, any, ICreateBlogPayload>, res: Response<IBlogView>, next: NextFunction) => {
  const newBlog = req.body;

  try {
    const blog = await BlogsService.createBlog(newBlog);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(blogObjMapper(blog));
  } catch (err) {
    next(err);
  }
};

const createPostForBlog = async (req: Request<{ blogId: ObjectId }, any, Omit<ICreatePostBody, 'blogId'>>, res: Response<IPostView>, next: NextFunction) => {
  const blogId = req.params.blogId;
  const newPost = { ...req.body, blogId };

  try {
    if (!ObjectId.isValid(blogId)) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blog = await BlogsRepository.getBlogById(blogId);

    if (!blog) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const createdBlog = await PostsService.createPost(newPost);

    res.status(HTTP_STATUS_CODES.SUCCESS_201).json(postObjMapper(createdBlog));
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req: Request<{ blogId: ObjectId }, any, IUpdateBlogPayload>, res: Response<void>, next: NextFunction) => {
  const blogId = req.params.blogId;
  const newBlog = req.body;

  try {
    await BlogsService.updateBlog(blogId, newBlog);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req: Request<{ blogId: ObjectId }>, res: Response<void>, next: NextFunction) => {
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
  getPostsForBlog,
  createBlog,
  createPostForBlog,
  updateBlog,
  deleteBlog,
};
