import { IBlog } from '@/types/blogs/blog';
import { ObjectId } from 'mongodb';

type BlogMongo = IBlog & { _id: ObjectId };

// map the response and get rid of _id
export function blogObjMapper(blog: BlogMongo): IBlog {
  return {
    id: blog._id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt,
  };
}
