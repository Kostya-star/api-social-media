import { Router } from 'express';
import { checkAuth } from '@/middlewares/checkAuth';
import usersController from '@/controllers/users-controller';
import { validateUserFields } from '@/middlewares/users/validate-user-fields';

export const usersRoutes = Router();

usersRoutes.get('/', checkAuth, usersController.getAllUsers);
usersRoutes.post('/', checkAuth, validateUserFields, usersController.createUser);
usersRoutes.delete('/:userId', checkAuth, usersController.deleteUser);
