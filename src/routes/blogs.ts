import { Router } from 'express';
import blogsControllers from '@/controllers/blogs';
import { checkAuth } from '@/middlewares/checkAuth';
import { validateCreateBlogPayload } from '@/middlewares/blogs/validate-create-blog-payload';

export const blogsRoutes = Router();

blogsRoutes.get('/', blogsControllers.getAllBlogs);
blogsRoutes.get('/:blogId', blogsControllers.getBlogById); // to do tests!!!
blogsRoutes.post('/', checkAuth, validateCreateBlogPayload, blogsControllers.createBlog); // to do tests!!!
