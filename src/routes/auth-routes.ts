import { Router } from 'express';
import authController from '@/controllers/auth-controller';
import { validateAuthLoginFields } from '@/middlewares/auth/validate-auth-login-fields';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';
import { validateUserRegistrationFields } from '@/middlewares/auth/validate-user-registration-fields';

export const authRoutes = Router();

authRoutes.post('/registration', validateUserRegistrationFields, authController.selfRegistration);
authRoutes.post('/login', validateAuthLoginFields, authController.login);
authRoutes.get('/me', checkBearerAuth, authController.getMe);
