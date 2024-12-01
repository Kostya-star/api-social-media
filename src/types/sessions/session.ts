import { ObjectId } from 'mongodb';

export interface ISession {
  sessionId: string;
  userId: ObjectId;
  issuedAt: number; // UNIX
  expiresAt: number; // UNIX
  userAgent: string;
  ipAddress: string;
  lastActiveDate: number; // UNIX
}

export interface ISessionReturn {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}
