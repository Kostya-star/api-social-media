import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import TestingService from '@/services/testing';

const deleteAllData = (req: Request, res: Response, next: NextFunction) => {
  try {
    TestingService.deleteAllData();

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  deleteAllData,
};
