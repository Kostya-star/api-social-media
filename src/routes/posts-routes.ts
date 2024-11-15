import { Router } from 'express';
import postsControllers from '@/controllers/posts-controller';
import { checkAuth } from '@/middlewares/checkAuth';
import { validatePostFields } from '@/middlewares/posts/validate-post-fields';
import { body } from 'express-validator';

export const postsRoutes = Router();

postsRoutes.get('/', postsControllers.getAllPosts);
postsRoutes.get('/:postId', postsControllers.getPostById);
postsRoutes.post('/', checkAuth, validatePostFields(body), postsControllers.createPost);
postsRoutes.put('/:postId', checkAuth, validatePostFields(body), postsControllers.updatePost);
postsRoutes.delete('/:postId', checkAuth, postsControllers.deletePost);
