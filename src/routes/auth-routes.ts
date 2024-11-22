import { Router } from 'express';
import authController from '@/controllers/auth-controller';
import { validateAuthLoginFields } from '@/middlewares/users/validate-auth-login-fields';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';

export const authRoutes = Router();

authRoutes.post('/login', validateAuthLoginFields, authController.login);
authRoutes.get('/me', checkBearerAuth, authController.me);
