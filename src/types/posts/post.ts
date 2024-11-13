import { ObjectId } from 'mongodb';

export interface IPost {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
}
