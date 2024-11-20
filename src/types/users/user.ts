import { ObjectId } from 'mongodb';

export interface IUser {
  id?: ObjectId;
  login: string;
  email: string;
  hashedPassword?: string;
  createdAt: Date;
}
