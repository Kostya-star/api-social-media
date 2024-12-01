import { ObjectId } from 'mongodb';

export interface ISession {
  deviceId: string;
  userId: ObjectId;
  issuedAt: string;
  expiresAt: string;
  userAgent: string;
  ipAddress: string;
  lastActiveDate: string;
}

export interface ISessionReturn {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}
