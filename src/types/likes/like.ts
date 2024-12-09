import { LikeStatus } from '@/const/likes/like-status';
import { MongooseObjtId } from '../mongoose-object-id';

export interface ILikeDB {
  _id: MongooseObjtId;
  status: LikeStatus;
  userId: MongooseObjtId;
  likedEntityId: MongooseObjtId;
  userLogin: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILikeBaseView {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}

export interface ILikesInfoView {
  likesInfo: ILikeBaseView;
}

export interface INewestLikesView {
  addedAt: Date; // ISO Date
  userId: MongooseObjtId;
  login: string;
}

export interface IExtendedLikesInfoView<T> {
  extendedLikesInfo: ILikeBaseView & {
    newestLikes: T[];
  };
}
