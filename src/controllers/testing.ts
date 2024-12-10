import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { BlogModel } from '@/DB/models/blogs-model';
import { PostModel } from '@/DB/models/posts-model';
import { UserModel } from '@/DB/models/users-model';
import { SessionModel } from '@/DB/models/devices-model';
import { CommentModel } from '@/DB/models/comments-model';
import { ReqRateModel } from '@/DB/models/req-rate-model';
import { LikeModel } from '@/DB/models/likes-model';
import { injectable } from 'inversify';

@injectable()
export class TestingController {
  async deleteAllData(req: Request, res: Response, next: NextFunction) {
    try {
      await BlogModel.deleteMany({});
      await PostModel.deleteMany({});
      await UserModel.deleteMany({});
      await SessionModel.deleteMany({});
      await CommentModel.deleteMany({});
      await ReqRateModel.deleteMany({});
      await LikeModel.deleteMany({});

      res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
    } catch (err) {
      next(err);
    }
  }
}
