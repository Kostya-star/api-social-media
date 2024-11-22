import { Router } from 'express';
import blogsControllers from '@/controllers/blogs-controller';
import { checkBasicAuth } from '@/middlewares/check-basic-auth';
import { validateBlogFields } from '@/middlewares/blogs/validate-blog-fields';
import { APP_ROUTES } from '@/routing';
import { validateCreatePostForBlogFields } from '@/middlewares/posts/validate-create-post-for-blog-fields';

export const blogsRoutes = Router();

blogsRoutes.get('/', blogsControllers.getAllBlogs);
blogsRoutes.get('/:blogId', blogsControllers.getBlogById);

// endpoing for getting posts for the specific blog
blogsRoutes.get(`/:blogId${APP_ROUTES.POSTS}`, blogsControllers.getPostsForBlog);

blogsRoutes.post('/', checkBasicAuth, validateBlogFields, blogsControllers.createBlog);

// endpoing for creating a post for the specific blog
blogsRoutes.post(`/:blogId${APP_ROUTES.POSTS}`, checkBasicAuth, validateCreatePostForBlogFields, blogsControllers.createPostForBlog);

blogsRoutes.put('/:blogId', checkBasicAuth, validateBlogFields, blogsControllers.updateBlog);
blogsRoutes.delete('/:blogId', checkBasicAuth, blogsControllers.deleteBlog);
