import { IBlogDB } from '@/types/blogs/blog';
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema<IBlogDB>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    isMembership: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const BlogModel = mongoose.model<IBlogDB>('Blog', blogSchema);
