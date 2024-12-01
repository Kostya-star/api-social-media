import { Router } from 'express';
import { checkRefreshToken } from '@/middlewares/auth/checkRefreshToken';
import devicesController from '@/controllers/devices-controller';

export const devicesRoutes = Router();

devicesRoutes.get('/', checkRefreshToken, devicesController.getUserDevices);
devicesRoutes.delete('/', checkRefreshToken, devicesController.terminateOtherSessions);
devicesRoutes.delete('/:sessionId', checkRefreshToken, devicesController.terminateSessionById);
