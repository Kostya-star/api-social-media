import { IReqRateLimiter } from '@/types/req-rate-limiter';
import mongoose from 'mongoose';

const reqRateSchema = new mongoose.Schema<IReqRateLimiter>(
  {
    url: { type: String, required: true },
    ip: { type: String, required: true },
    timestamps: { type: [Number], required: true }, // Array of numbers
  },
  {
    timestamps: false,
  }
);

export const ReqRateModel = mongoose.model<IReqRateLimiter>('Req-Rate', reqRateSchema);
