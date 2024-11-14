import { ObjectId } from 'mongodb';

export interface IPost {
  // _id?: ObjectId;
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  // blogId: ObjectId;
  blogId: string;
  blogName: string;
  createdAt: Date
}
