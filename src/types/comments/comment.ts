import { ObjectId } from 'mongodb';

export interface IComment {
  _id?: ObjectId;
  id?: ObjectId;
  content: string;
  postId?: ObjectId;
  commentatorInfo: {
    userId: ObjectId;
    userLogin: string;
  };
  createdAt: Date;
}
