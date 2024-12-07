import { Router } from 'express';
import { checkRefreshToken } from '@/middlewares/auth/checkRefreshToken';
import { devicesController } from '@/composition-api';

export const devicesRoutes = Router();

devicesRoutes.get('/', checkRefreshToken, devicesController.getUserDevices.bind(devicesController));
devicesRoutes.delete('/', checkRefreshToken, devicesController.terminateOtherSessions.bind(devicesController));
devicesRoutes.delete('/:deviceId', checkRefreshToken, devicesController.terminateSessionById.bind(devicesController));
