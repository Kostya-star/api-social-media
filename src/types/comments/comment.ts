import { ObjectId } from 'mongodb';

export interface IComment {
  _id?: ObjectId;
  id?: ObjectId;
  content: string;
  commentatorInfo: {
    userId: ObjectId;
    userLogin: string;
  };
  createdAt: Date;
}
