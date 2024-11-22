import { Router } from 'express';
import postsControllers from '@/controllers/posts-controller';
import { checkBasicAuth } from '@/middlewares/check-basic-auth';
import { validateCreatePostFields } from '@/middlewares/posts/validate-create-post-fields';

export const postsRoutes = Router();

postsRoutes.get('/', postsControllers.getAllPosts);
postsRoutes.get('/:postId', postsControllers.getPostById);
postsRoutes.post('/', checkBasicAuth, validateCreatePostFields, postsControllers.createPost);
postsRoutes.put('/:postId', checkBasicAuth, validateCreatePostFields, postsControllers.updatePost);
postsRoutes.delete('/:postId', checkBasicAuth, postsControllers.deletePost);
