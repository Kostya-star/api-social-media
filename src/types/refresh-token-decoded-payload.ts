import { Types } from 'mongoose';

export interface IRefreshTokenDecodedPayload {
  userId: Types.ObjectId;
  deviceId: string;
  iat: number;
  exp: number;
}
