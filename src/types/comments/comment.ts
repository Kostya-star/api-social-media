import { LikeStatus } from '@/const/likes/like-status';
import { Types } from 'mongoose';

export interface ICommentDB {
  _id: Types.ObjectId;
  content: string;
  postId: Types.ObjectId;
  commentatorInfo: {
    userId: Types.ObjectId;
    userLogin: string;
  };
  // NOTE: likesInfo never takes place in comment in DB. this is a hack and temp solution for ts not to yell in comments-repo/getCommentById
  likesInfo?: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentView extends Omit<ICommentDB, '_id' | 'updatedAt' | 'postId'> {
  id: Types.ObjectId;
}
