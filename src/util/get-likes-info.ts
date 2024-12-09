import { LikeStatus } from '@/const/likes/like-status';
import { ILikeDB } from '@/types/likes/like';
import { MongooseObjtId } from '@/types/mongoose-object-id';

interface ILikesInfoReturned {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: ILikeDB[];
}

export function getLikesInfo(allLikes: ILikeDB[], currentUserId?: MongooseObjtId): ILikesInfoReturned {
  const likes = allLikes.filter((like) => like.status === LikeStatus.Like);
  const dislikesCount = allLikes.filter((like) => like.status === LikeStatus.Dislike).length;
  const myStatus = allLikes.find((like) => currentUserId?.toString() === like.userId.toString())?.status ?? LikeStatus.None;
  const newestLikes = likes.slice(0, 3);

  return { likesCount: likes.length, dislikesCount, myStatus, newestLikes };
}
