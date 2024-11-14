import { ObjectId } from 'mongodb';

export interface IUpdatePostBody {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}
