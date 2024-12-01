import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import RequestsRateRepository from '@/repositories/requests-rate-repository';
import { ErrorService } from '@/services/error-service';
import { NextFunction, Request, Response } from 'express';

const MAX_REQUESTS_PER_10_SECS = 5;

export async function reqRateLimiter(req: Request<any>, res: Response, next: NextFunction) {
  const url = req.originalUrl || req.baseUrl;
  const ip = req.ip!;
  const date = Math.floor(Date.now() / 1000); // time in UNIX in seconds

  try {
    const resp = await RequestsRateRepository.getUpdatedRate({ ip, url }, date);
    const times = resp?.timestamps ?? [];

    if (times.length > MAX_REQUESTS_PER_10_SECS) {
      return next(ErrorService(HTTP_ERROR_MESSAGES.TOO_MANY_REQUESTS_429, HTTP_STATUS_CODES.TOO_MANY_REQUESTS_429));
    }

    next();
  } catch (err) {
    next(err);
  }
}
