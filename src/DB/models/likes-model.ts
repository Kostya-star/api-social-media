import { LikeStatus } from '@/const/likes/like-status';
import { ILikeDB } from '@/types/likes/like';
import { Schema, model } from 'mongoose';

const likesSchema = new Schema<ILikeDB>(
  {
    status: { type: String, enum: LikeStatus, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    likedEntityId: { type: Schema.Types.ObjectId, required: true },
    userLogin: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const LikeModel = model<ILikeDB>('Likes', likesSchema);
