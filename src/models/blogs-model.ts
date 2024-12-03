import { IBlogDB } from '@/types/blogs/blog';
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema<IBlogDB>(
  {
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    isMembership: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const BlogModel = mongoose.model<IBlogDB>('Blog', blogSchema);
