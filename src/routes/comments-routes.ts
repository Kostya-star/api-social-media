import { Router } from 'express';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';
import commentsController from '@/controllers/comments-controller';
import { validateCommentFields } from '@/middlewares/comments/validate-comment-fields';

export const commentsRoutes = Router();

commentsRoutes.get('/:commentId', commentsController.getCommentById);
commentsRoutes.put('/:commentId', checkBearerAuth, validateCommentFields, commentsController.updateComment);
commentsRoutes.delete('/:commentId', checkBearerAuth, commentsController.deleteComment);
