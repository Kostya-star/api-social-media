import { Router } from 'express';
import { checkBasicAuth } from '@/middlewares/check-basic-auth';
import { validateUserRegistrationFields } from '@/middlewares/auth/validate-user-registration-fields';
import { usersController } from '@/composition-root';

export const usersRoutes = Router();

usersRoutes.get('/', checkBasicAuth, usersController.getAllUsers.bind(usersController));
usersRoutes.post('/', checkBasicAuth, validateUserRegistrationFields, usersController.adminCreatesUser.bind(usersController));
usersRoutes.delete('/:userId', checkBasicAuth, usersController.deleteUser.bind(usersController));
