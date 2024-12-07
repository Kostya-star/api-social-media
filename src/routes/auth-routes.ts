import { Router } from 'express';
import { validateAuthLoginFields } from '@/middlewares/auth/validate-auth-login-fields';
import { checkBearerAuth } from '@/middlewares/check-bearer-auth';
import { validateUserRegistrationFields } from '@/middlewares/auth/validate-user-registration-fields';
import { validateUserEmailMdlwr } from '@/middlewares/auth/validate-user-email.mdlwr';
import { checkRefreshToken } from '@/middlewares/auth/checkRefreshToken';
import { reqRateLimiter } from '@/middlewares/requests-rate-limiter';
import { validateUserPasswordMdlwr } from '@/middlewares/auth/validate-user-pswrd-mdlwr';
import { authController } from '@/composition-api';

export const authRoutes = Router();

authRoutes.post('/registration', reqRateLimiter, validateUserRegistrationFields, authController.selfRegistration.bind(authController));
authRoutes.post('/registration-confirmation', reqRateLimiter, authController.registrationConfirmation.bind(authController));
authRoutes.post('/registration-email-resending', reqRateLimiter, validateUserEmailMdlwr, authController.registrationEmailCodeResending.bind(authController));
authRoutes.post('/login', reqRateLimiter, validateAuthLoginFields, authController.login.bind(authController));
authRoutes.post('/refresh-token', checkRefreshToken, authController.refreshToken.bind(authController));
authRoutes.post('/password-recovery', reqRateLimiter, validateUserEmailMdlwr, authController.recoverPassword.bind(authController));
authRoutes.post('/new-password', reqRateLimiter, validateUserPasswordMdlwr, authController.changePassword.bind(authController));
authRoutes.get('/me', checkBearerAuth, authController.getMe.bind(authController));
authRoutes.post('/logout', checkRefreshToken, authController.logout.bind(authController));
