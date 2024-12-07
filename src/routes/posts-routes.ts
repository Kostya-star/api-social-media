import { Router } from 'express';
import { checkBasicAuth } from '@/middlewares/check-basic-auth';
import { APP_ROUTES } from '@/routing';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';
import { validateCommentFields } from '@/middlewares/comments/validate-comment-fields';
import { attachAccessTokenToReq } from '@/middlewares/attach-access-token-to-req';
import { postsController } from '@/composition-api';
import { validateCreatePostFields } from '@/middlewares/posts/validate-create-post-fields';

export const postsRoutes = Router();

postsRoutes.get('/', postsController.getAllPosts.bind(postsController));
postsRoutes.get('/:postId', postsController.getPostById.bind(postsController));
postsRoutes.post('/', checkBasicAuth, validateCreatePostFields, postsController.createPost.bind(postsController));

postsRoutes.get(`/:postId${APP_ROUTES.COMMENTS}`, attachAccessTokenToReq, postsController.getCommentsForPost.bind(postsController));
postsRoutes.post(`/:postId${APP_ROUTES.COMMENTS}`, checkBearerAuth, validateCommentFields, postsController.createCommentForPost.bind(postsController));

postsRoutes.put('/:postId', checkBasicAuth, validateCreatePostFields, postsController.updatePost.bind(postsController));
postsRoutes.delete('/:postId', checkBasicAuth, postsController.deletePost.bind(postsController));
