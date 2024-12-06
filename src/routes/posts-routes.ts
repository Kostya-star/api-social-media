import { Router } from 'express';
import postsControllers from '@/controllers/posts-controller';
import { checkBasicAuth } from '@/middlewares/check-basic-auth';
import { validateCreatePostFields } from '@/middlewares/posts/validate-create-post-fields';
import { APP_ROUTES } from '@/routing';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';
import { validateCommentFields } from '@/middlewares/comments/validate-comment-fields';
import { attachAccessTokenToReq } from '@/middlewares/attach-access-token-to-req.ts';

export const postsRoutes = Router();

postsRoutes.get('/', postsControllers.getAllPosts);
postsRoutes.get('/:postId', postsControllers.getPostById);
postsRoutes.post('/', checkBasicAuth, validateCreatePostFields, postsControllers.createPost);

postsRoutes.get(`/:postId${APP_ROUTES.COMMENTS}`, attachAccessTokenToReq, postsControllers.getCommentsForPosts);
postsRoutes.post(`/:postId${APP_ROUTES.COMMENTS}`, checkBearerAuth, validateCommentFields, postsControllers.createCommentForPost);

postsRoutes.put('/:postId', checkBasicAuth, validateCreatePostFields, postsControllers.updatePost);
postsRoutes.delete('/:postId', checkBasicAuth, postsControllers.deletePost);
