import { Router } from 'express';
import authController from '@/controllers/auth-controller';
import { validateAuthLoginFields } from '@/middlewares/users/validate-auth-login-fields';

export const authRoutes = Router();

authRoutes.post('/login', validateAuthLoginFields, authController.login);
