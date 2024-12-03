import { Types } from 'mongoose';

export interface IBlogDB {
  _id: Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogView extends Omit<IBlogDB, '_id' | 'updatedAt'> {
  id?: Types.ObjectId;
}
