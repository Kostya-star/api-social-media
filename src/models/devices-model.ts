import { ISessionDB } from '@/types/sessions/session';
import { Schema, model } from 'mongoose';

const sessionSchema = new Schema<ISessionDB>(
  {
    deviceId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    issuedAt: { type: String, required: true },
    expiresAt: { type: String, required: true },
    userAgent: { type: String, required: true },
    ipAddress: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const SessionModel = model<ISessionDB>('Session', sessionSchema);
