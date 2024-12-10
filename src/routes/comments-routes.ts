import { Router } from 'express';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';
import { validateCommentFields } from '@/middlewares/comments/validate-comment-fields';
import { validateLikeStatus } from '@/middlewares/likes/validate-like-status';
import { attachAccessTokenToReq } from '@/middlewares/attach-access-token-to-req';
import { commentsController } from '@/composition-root';

export const commentsRoutes = Router();

commentsRoutes.get('/:commentId', attachAccessTokenToReq, commentsController.getCommentById.bind(commentsController));
commentsRoutes.put('/:commentId', checkBearerAuth, validateCommentFields, commentsController.updateComment.bind(commentsController));
commentsRoutes.put('/:commentId/like-status', checkBearerAuth, validateLikeStatus, commentsController.handleCommentLike.bind(commentsController));
commentsRoutes.delete('/:commentId', checkBearerAuth, commentsController.deleteComment.bind(commentsController));
