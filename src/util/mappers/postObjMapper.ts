import { IPostDB, IPostView } from '@/types/posts/post';

export function postObjMapper(post: IPostDB): IPostView {
  return {
    id: post._id,
    title: post.title,
    content: post.content,
    shortDescription: post.shortDescription,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
