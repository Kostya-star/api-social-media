import { ObjectId } from 'mongodb';

export interface IBlog {
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
}
