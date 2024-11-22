import { Router } from 'express';
import { checkBasicAuth } from '@/middlewares/check-basic-auth';
import usersController from '@/controllers/users-controller';
import { validateUserFields } from '@/middlewares/users/validate-user-fields';

export const usersRoutes = Router();

usersRoutes.get('/', checkBasicAuth, usersController.getAllUsers);
usersRoutes.post('/', checkBasicAuth, validateUserFields, usersController.createUser);
usersRoutes.delete('/:userId', checkBasicAuth, usersController.deleteUser);
