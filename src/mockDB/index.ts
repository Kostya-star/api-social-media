import { IBlog } from '@/types/blogs/blog';
import { IPost } from '@/types/posts/post';

interface MockDB {
  blogs: IBlog[];
  posts: IPost[];
}

export const mockDB: MockDB = {
  blogs: [
    // {
    //   id: '1',
    //   name: 'ssdds',
    //   description: 'dsdsd',
    //   websiteUrl: 'dsdsd',
    // },
  ],
  posts: [],
};
