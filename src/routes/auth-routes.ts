import { Router } from 'express';
import authController from '@/controllers/auth-controller';
import { validateAuthLoginFields } from '@/middlewares/auth/validate-auth-login-fields';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';
import { validateUserRegistrationFields } from '@/middlewares/auth/validate-user-registration-fields';
import { validateUserRegistrationEmailResending } from '@/middlewares/auth/validate-user-registration-email-resending';
import { checkRefreshToken } from '@/middlewares/auth/checkRefreshToken';
import { reqRateLimiter } from '@/middlewares/requests-rate-limiter';

export const authRoutes = Router();

authRoutes.post('/registration', reqRateLimiter, validateUserRegistrationFields, authController.selfRegistration);
authRoutes.post('/registration-confirmation', reqRateLimiter, authController.registrationConfirmation);
authRoutes.post('/registration-email-resending', reqRateLimiter, validateUserRegistrationEmailResending, authController.registrationEmailCodeResending);
authRoutes.post('/login', reqRateLimiter, validateAuthLoginFields, authController.login);
authRoutes.post('/refresh-token', checkRefreshToken, authController.refreshToken);
authRoutes.get('/me', checkBearerAuth, authController.getMe);
authRoutes.post('/logout', checkRefreshToken, authController.logout);
