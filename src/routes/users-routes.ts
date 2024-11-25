import { Router } from 'express';
import { checkBasicAuth } from '@/middlewares/check-basic-auth';
import usersController from '@/controllers/users-controller';
import { validateUserRegistrationFields } from '@/middlewares/auth/validate-user-registration-fields';

export const usersRoutes = Router();

usersRoutes.get('/', checkBasicAuth, usersController.getAllUsers);
usersRoutes.post('/', checkBasicAuth, validateUserRegistrationFields, usersController.adminCreatesUser);
usersRoutes.delete('/:userId', checkBasicAuth, usersController.deleteUser);
