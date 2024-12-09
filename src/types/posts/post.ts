import { Types } from 'mongoose';
import { IExtendedLikesInfoView, INewestLikesView } from '../likes/like';

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

export interface IPostView extends Omit<IPostDB, '_id' | 'updatedAt'>, IExtendedLikesInfoView<INewestLikesView> {
  id: Types.ObjectId;
}
