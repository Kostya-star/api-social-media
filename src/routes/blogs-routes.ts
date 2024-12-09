import { Router } from 'express';
import { checkBasicAuth } from '@/middlewares/check-basic-auth';
import { validateBlogFields } from '@/middlewares/blogs/validate-blog-fields';
import { APP_ROUTES } from '@/routing';
import { validateCreatePostForBlogFields } from '@/middlewares/posts/validate-create-post-for-blog-fields';
import { blogsController } from '@/composition-api';
import { attachAccessTokenToReq } from '@/middlewares/attach-access-token-to-req';

export const blogsRoutes = Router();

blogsRoutes.get('/', blogsController.getAllBlogs.bind(blogsController));
blogsRoutes.get('/:blogId', blogsController.getBlogById.bind(blogsController));

// endpoing for getting posts for the specific blog
blogsRoutes.get(`/:blogId${APP_ROUTES.POSTS}`, attachAccessTokenToReq, blogsController.getPostsForBlog.bind(blogsController));

blogsRoutes.post('/', checkBasicAuth, validateBlogFields, blogsController.createBlog.bind(blogsController));

// endpoing for creating a post for the specific blog
blogsRoutes.post(`/:blogId${APP_ROUTES.POSTS}`, checkBasicAuth, validateCreatePostForBlogFields, blogsController.createPostForBlog.bind(blogsController));

blogsRoutes.put('/:blogId', checkBasicAuth, validateBlogFields, blogsController.updateBlog.bind(blogsController));
blogsRoutes.delete('/:blogId', checkBasicAuth, blogsController.deleteBlog.bind(blogsController));
