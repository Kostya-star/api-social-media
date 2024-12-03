import { Types } from 'mongoose';

export interface ISessionDB {
  _id: Types.ObjectId;
  deviceId: string;
  userId: Types.ObjectId;
  issuedAt: string;
  expiresAt: string;
  userAgent: string;
  ipAddress: string;
  lastActiveDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionView {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}
