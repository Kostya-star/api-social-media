import { ICommentDB } from '@/types/comments/comment';
import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema<ICommentDB>(
  {
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    commentatorInfo: {
      userId: { type: Schema.Types.ObjectId, required: true },
      userLogin: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const CommentModel = mongoose.model<ICommentDB>('Comment', commentSchema);
