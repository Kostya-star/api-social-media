import { Types } from 'mongoose';

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

export interface ICommentView extends Omit<ICommentDB, '_id' | 'updatedAt' | 'postId'> {
  id: Types.ObjectId;
}
