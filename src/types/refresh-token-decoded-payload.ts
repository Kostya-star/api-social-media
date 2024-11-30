import { ObjectId } from 'mongodb';

export interface IRefreshTokenDecodedPayload {
  userId: ObjectId;
  sessionId: string;
  iat: number;
  exp: number;
}
