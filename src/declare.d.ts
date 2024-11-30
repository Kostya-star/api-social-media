import { ObjectId } from 'mongodb';

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
