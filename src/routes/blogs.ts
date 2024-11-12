import { Router } from 'express';
import blogsControllers from '@/controllers/blogs';
import { checkAuth } from '@/middlewares/checkAuth';
import { validateBlogFields } from '@/middlewares/blogs/validate-blog-fields';

export const blogsRoutes = Router();

blogsRoutes.get('/', blogsControllers.getAllBlogs);
// blogsRoutes.get('/:blogId', blogsControllers.getBlogById);
blogsRoutes.post('/', checkAuth, validateBlogFields, blogsControllers.createBlog);
// blogsRoutes.put('/:blogId', checkAuth, validateBlogFields, blogsControllers.updateBlog);
// blogsRoutes.delete('/:blogId', checkAuth, blogsControllers.deleteBlog);
