import { ObjectId } from 'mongodb';

export interface IRefreshTokenDecodedPayload {
  userId: ObjectId;
  deviceId: string;
  iat: number;
  exp: number;
}
