import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import SessionsRepository from '@/repositories/sessions-repository';
import { ISessionView } from '@/types/sessions/session';
import { deviceObjMapper } from '@/util/deviceObjMapper';
import SessionsService from '@/services/sessions-service';

const getUserDevices = async (req: Request, res: Response<ISessionView[]>, next: NextFunction) => {
  try {
    const { userId } = req.refresh_token_decoded_payload;

    const devices = await SessionsRepository.findUserSessions(userId);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json(devices.map(deviceObjMapper));
  } catch (err) {
    next(err);
  }
};

const terminateOtherSessions = async (req: Request, res: Response<void>, next: NextFunction) => {
  try {
    const { userId, deviceId } = req.refresh_token_decoded_payload;

    await SessionsService.deleteSessionsExceptCurrent(userId, deviceId);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

const terminateSessionById = async (req: Request<{ deviceId: string }>, res: Response<void>, next: NextFunction) => {
  try {
    const { userId } = req.refresh_token_decoded_payload;
    const { deviceId } = req.params;

    await SessionsService.deleteSessionById(userId, deviceId);

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  getUserDevices,
  terminateOtherSessions,
  terminateSessionById,
};
