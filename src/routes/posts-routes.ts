import { Router } from 'express';
import postsControllers from '@/controllers/posts-controller';
import { checkAuth } from '@/middlewares/checkAuth';
import { validateCreatePostFields } from '@/middlewares/posts/validate-create-post-fields';

export const postsRoutes = Router();

postsRoutes.get('/', postsControllers.getAllPosts);
postsRoutes.get('/:postId', postsControllers.getPostById);
postsRoutes.post('/', checkAuth, validateCreatePostFields, postsControllers.createPost);
postsRoutes.put('/:postId', checkAuth, validateCreatePostFields, postsControllers.updatePost);
postsRoutes.delete('/:postId', checkAuth, postsControllers.deletePost);
