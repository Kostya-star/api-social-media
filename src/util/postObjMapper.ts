import { IPost } from '@/types/posts/post';
import { ObjectId } from 'mongodb';

type PostMongo = IPost & { _id: ObjectId };

// map the response and get rid of _id
export function postObjMapper(post: PostMongo): IPost {
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
