export interface IReqRateLimiter {
  url: string;
  ip: string;
  timestamps: number[]; // UNIX[]
}
