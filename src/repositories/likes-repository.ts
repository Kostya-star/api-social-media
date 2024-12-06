import { LikeStatus } from '@/const/likes/like-status';
import { LikeModel } from '@/DB/models/likes-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';

const updateLike = async (likedEntityId: MongooseObjtId, status: LikeStatus, userId: MongooseObjtId): Promise<void> => {
  await LikeModel.findOneAndUpdate({ userId, likedEntityId }, { likedEntityId, userId, status }, { upsert: true });
};

export default {
  updateLike,
};
