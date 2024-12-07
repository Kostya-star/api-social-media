import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ISessionView } from '@/types/sessions/session';
import SessionsRepositoryQuery from '@/repositories/sessions/sessions-repository-query';
import { SessionsService } from '@/services/sessions-service';

export class DevicesController {
  protected sessionsService;

  constructor(sessionsService: SessionsService) {
    this.sessionsService = sessionsService
  }

  async getUserDevices(req: Request, res: Response<ISessionView[]>, next: NextFunction) {
    try {
      const { userId } = req.refresh_token_decoded_payload;

      const devices = await SessionsRepositoryQuery.findUserSessions(userId);

      res.status(HTTP_STATUS_CODES.SUCCESS_200).json(devices);
    } catch (err) {
      next(err);
    }
  }

  async terminateOtherSessions(req: Request, res: Response<void>, next: NextFunction) {
    try {
      const { userId, deviceId } = req.refresh_token_decoded_payload;

      await this.sessionsService.deleteSessionsExceptCurrent(userId, deviceId);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }

  async terminateSessionById(req: Request<{ deviceId: string }>, res: Response<void>, next: NextFunction) {
    try {
      const { userId } = req.refresh_token_decoded_payload;
      const { deviceId } = req.params;

      await this.sessionsService.deleteSessionById(userId, deviceId);

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }
}
