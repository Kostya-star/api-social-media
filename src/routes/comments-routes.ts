import { Router } from 'express';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';
import commentsController from '@/controllers/comments-controller';
import { validateCommentFields } from '@/middlewares/comments/validate-comment-fields';
import { validateLikeStatus } from '@/middlewares/likes/validate-like-status';
import { attachAccessTokenToReq } from '@/middlewares/attach-access-token-to-req';

export const commentsRoutes = Router();

commentsRoutes.get('/:commentId', attachAccessTokenToReq, commentsController.getCommentById);
commentsRoutes.put('/:commentId', checkBearerAuth, validateCommentFields, commentsController.updateComment);
commentsRoutes.put('/:commentId/like-status', checkBearerAuth, validateLikeStatus, commentsController.handleCommentLike);
commentsRoutes.delete('/:commentId', checkBearerAuth, commentsController.deleteComment);
