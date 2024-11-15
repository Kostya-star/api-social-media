import { ObjectId } from 'mongodb';

export interface IPost {
  // _id?: ObjectId;
  id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  // blogId: ObjectId;
  blogId: ObjectId;
  blogName: string;
  createdAt: Date
}
