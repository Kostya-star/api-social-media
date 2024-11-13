import { ObjectId } from 'mongodb';

export interface ICreatePostBody {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
}
