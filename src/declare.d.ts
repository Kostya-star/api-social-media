import { ObjectId } from 'mongodb';
import { IRefreshTokenDecodedPayload } from './types/refresh-token-decoded-payload';

declare global {
  namespace Express {
    export interface Request {
      userId?: ObjectId;
      refresh_token_decoded_payload: IRefreshTokenDecodedPayload;
      cookies: {
        refreshToken?: string;
      };
    }
  }
}
