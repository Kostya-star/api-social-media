import { TYPES } from '@/composition-root-types';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { RequestsRateRepositoryCommands } from '@/repositories/requests-rate-repository';
import { ErrorService } from '@/services/error-service';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ReqRateLimiter {
  protected reqRateRepository;
  MAX_REQUESTS_PER_10_SECS = 5;

  constructor(@inject(TYPES.requestsRateRepositoryCommands) reqRateRepository: RequestsRateRepositoryCommands) {
    this.reqRateRepository = reqRateRepository;

    this.reqRateLimiter = this.reqRateLimiter.bind(this);
  }

  async reqRateLimiter(req: Request<any>, res: Response, next: NextFunction) {
    const url = req.originalUrl || req.baseUrl;
    const ip = req.ip!;
    const date = Math.floor(Date.now() / 1000); // time in UNIX in seconds

    try {
      const resp = await this.reqRateRepository.getUpdatedRate({ ip, url }, date);
      const times = resp?.timestamps ?? [];

      if (times.length > this.MAX_REQUESTS_PER_10_SECS) {
        return next(ErrorService(HTTP_ERROR_MESSAGES.TOO_MANY_REQUESTS_429, HTTP_STATUS_CODES.TOO_MANY_REQUESTS_429));
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}
