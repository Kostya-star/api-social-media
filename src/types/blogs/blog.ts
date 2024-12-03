import { ObjectId } from 'mongodb';

export interface IBlogDB {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogView extends Omit<IBlogDB, '_id' | 'updatedAt'> {
  id?: ObjectId;
}
