import { Types } from 'mongoose';

export interface IPostDB {
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
  blogName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostView extends Omit<IPostDB, '_id' | 'updatedAt'> {
  id: Types.ObjectId;
}
