import { IPostDB } from '@/types/posts/post';
import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema<IPostDB>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: Schema.Types.ObjectId, required: true },
    blogName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const PostModel = mongoose.model<IPostDB>('Post', postSchema);
