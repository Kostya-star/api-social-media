import { IBlogDB, IBlogView } from '@/types/blogs/blog';

export function blogObjMapper(blog: IBlogDB): IBlogView {
  return {
    id: blog._id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt,
  };
}
