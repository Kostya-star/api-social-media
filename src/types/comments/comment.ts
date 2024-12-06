import { Types } from 'mongoose';
import { ILikesInfoView } from '../likes/like';
import { LikeStatus } from '@/const/likes/like-status';

export interface ICommentDB {
  _id: Types.ObjectId;
  content: string;
  postId: Types.ObjectId;
  commentatorInfo: {
    userId: Types.ObjectId;
    userLogin: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentView extends Omit<ICommentDB, '_id' | 'updatedAt' | 'postId'>, ILikesInfoView {
  id: Types.ObjectId;
}
