import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { ObjectId } from 'mongodb';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { ErrorService } from '@/services/error-service';
import { GetAllBlogsQuery } from '@/types/blogs/getAllBlogsQuery';
import { IBaseQuery } from '@/types/base-query';
import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/const/query-defaults';
import { IBaseResponse } from '@/types/base-response';
import { IBlogView } from '@/types/blogs/blog';
import { IPostDB, IPostView } from '@/types/posts/post';
import BlogsRepositoryQuery from '@/repositories/blogs/blogs-repository-query';
import PostsRepositoryQuery from '@/repositories/posts/posts-repository-query';
import { PostsErrorsList } from '@/errors/posts-errors';
import { BlogsService } from '@/services/blogs-service';
import { PostsService } from '@/services/posts-service';

export class BlogsController {
  protected blogsService;
  protected postsService;

  constructor(blogsService: BlogsService, postsService: PostsService) {
    this.blogsService = blogsService;
    this.postsService = postsService;
  }

  async getAllBlogs(req: Request<any, any, any, GetAllBlogsQuery>, res: Response<IBaseResponse<IBlogView>>, next: NextFunction) {
    try {
      const searchNameTerm = req.query.searchNameTerm || null;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
      const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
      const pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

      const resp = await BlogsRepositoryQuery.getAllBlogs({
        searchNameTerm,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
      });

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
    } catch (err) {
      next(err);
    }
  }

  async getBlogById(req: Request<{ blogId: ObjectId }>, res: Response<IBlogView>, next: NextFunction) {
    const { blogId } = req.params;

    try {
      if (!ObjectId.isValid(blogId)) {
        throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const blog = await BlogsRepositoryQuery.getBlogById(blogId);

      if (!blog) {
        throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(blog);
    } catch (err) {
      next(err);
    }
  }

  async getPostsForBlog(req: Request<{ blogId: ObjectId }, any, any, IBaseQuery<IPostDB>>, res: Response<IBaseResponse<IPostView>>, next: NextFunction) {
    const { blogId } = req.params;

    try {
      const sortBy = req.query.sortBy || 'createdAt';
      const sortDirection = req.query.sortDirection || SORT_DIRECTIONS.DESC;
      const pageNumber = parseInt(String(req.query.pageNumber)) || DEFAULT_PAGE_NUMBER;
      const pageSize = parseInt(String(req.query.pageSize)) || DEFAULT_PAGE_SIZE;

      if (!ObjectId.isValid(blogId)) {
        throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const blog = await BlogsRepositoryQuery.getBlogById(blogId);

      if (!blog) {
        throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const resp = await PostsRepositoryQuery.getPostsForBlog(blogId, {
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
      });

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(resp);
    } catch (err) {
      next(err);
    }
  }

  async createBlog(req: Request<any, any, ICreateBlogPayload>, res: Response<IBlogView>, next: NextFunction) {
    const newBlog = req.body;

    try {
      const blogId = await this.blogsService.createBlog(newBlog);
      const blog = await BlogsRepositoryQuery.getBlogById(blogId);

      if (!blog) {
        throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUS_CODES.SUCCESS_201).json(blog);
    } catch (err) {
      next(err);
    }
  }

  async createPostForBlog(req: Request<{ blogId: ObjectId }, any, Omit<ICreatePostBody, 'blogId'>>, res: Response<IPostView>, next: NextFunction) {
    const blogId = req.params.blogId;
    const newPost = { ...req.body, blogId };

    try {
      if (!ObjectId.isValid(blogId)) {
        throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const blog = await BlogsRepositoryQuery.getBlogById(blogId);

      if (!blog) {
        throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const postId = await this.postsService.createPost(newPost);
      const post = await PostsRepositoryQuery.getPostById(postId);

      if (!post) {
        throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUS_CODES.SUCCESS_201).json(post);
    } catch (err) {
      next(err);
    }
  }

  async updateBlog(req: Request<{ blogId: ObjectId }, any, IUpdateBlogPayload>, res: Response<void>, next: NextFunction) {
    const blogId = req.params.blogId;
    const newBlog = req.body;

    try {
      await this.blogsService.updateBlog(blogId, newBlog);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }

  async deleteBlog(req: Request<{ blogId: ObjectId }>, res: Response<void>, next: NextFunction) {
    const blogId = req.params.blogId;

    try {
      await this.blogsService.deleteBlog(blogId);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }
}
