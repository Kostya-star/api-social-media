import { Types } from 'mongoose';

export interface ICreatePostBody {
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
}
