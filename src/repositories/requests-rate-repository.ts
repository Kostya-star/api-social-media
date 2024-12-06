import { ReqRateModel } from '@/DB/models/req-rate-model';
import { IReqRateLimiter } from '@/types/req-rate-limiter';
import { WithId } from 'mongodb';

interface ICreateReqRatePayload {
  ip: string;
  url: string;
}

export const getUpdatedRate = async ({ ip, url }: ICreateReqRatePayload, newTimestamp: number): Promise<WithId<IReqRateLimiter> | null> => {
  await ReqRateModel.updateOne(
    { ip, url },
    { $pull: { timestamps: { $lt: newTimestamp - 10 } } }, // Remove timestamps older than 10 seconds
    { upsert: true }
  );

  return await ReqRateModel.findOneAndUpdate(
    { ip, url },
    { $push: { timestamps: newTimestamp } }, // Add the current timestamp
    { upsert: true, returnDocument: 'after' } // Return the updated document
  );
};

export default {
  getUpdatedRate,
};
