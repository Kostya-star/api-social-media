import { requestsRateCollection } from '@/DB';
import { IReqRateLimiter } from '@/types/req-rate-limiter';
import { WithId } from 'mongodb';

export const getUpdatedRate = async ({ ip, url }: Partial<IReqRateLimiter>, newTimestamp: number): Promise<WithId<IReqRateLimiter> | null> => {
  await requestsRateCollection.updateOne(
    { ip, url },
    { $pull: { timestamps: { $lt: newTimestamp - 10 } } }, // Remove timestamps older than 10 seconds
    { upsert: true }
  );

  return requestsRateCollection.findOneAndUpdate(
    { ip, url },
    { $push: { timestamps: newTimestamp } }, // Add the current timestamp
    { upsert: true, returnDocument: 'after' } // Return the updated document
  );
};

export default {
  getUpdatedRate,
};
