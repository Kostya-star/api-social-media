import { LikeStatus } from '@/const/likes/like-status';
import { MongooseObjtId } from '../mongoose-object-id';

export interface ILikeDB {
  _id: MongooseObjtId;
  status: LikeStatus;
  userId: MongooseObjtId;
  likedEntityId: MongooseObjtId;
  createdAt: Date;
  updatedAt: Date;
}
