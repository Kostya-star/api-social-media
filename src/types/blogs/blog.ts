import { ObjectId } from 'mongodb';

export interface IBlog {
  id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
}
