import { Router } from 'express';
import blogsControllers from '@/controllers/blogs-controller';
import { checkAuth } from '@/middlewares/checkAuth';
import { validateBlogFields } from '@/middlewares/blogs/validate-blog-fields';
import { APP_ROUTES } from '@/routing';
import { validateCreatePostForBlogFields } from '@/middlewares/posts/validate-create-post-for-blog-fields';

export const blogsRoutes = Router();

blogsRoutes.get('/', blogsControllers.getAllBlogs);
blogsRoutes.get('/:blogId', blogsControllers.getBlogById);
blogsRoutes.post('/', checkAuth, validateBlogFields, blogsControllers.createBlog);

// endpoing for creating a post for the specific blog
blogsRoutes.post(`/:blogId${APP_ROUTES.POSTS}`, checkAuth, validateCreatePostForBlogFields, blogsControllers.createPostForBlog);

blogsRoutes.put('/:blogId', checkAuth, validateBlogFields, blogsControllers.updateBlog);
blogsRoutes.delete('/:blogId', checkAuth, blogsControllers.deleteBlog);
