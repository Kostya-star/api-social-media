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
    //   name: 'blogName',
    //   description: 'dsdsd',
    //   websiteUrl: 'dsdsd',
    // },
  ],
  posts: [
    // {
    //   id: '1',
    //   title: 'sdsds',
    //   shortDescription: 'dsdsd',
    //   content: 'sdsds',
    //   blogId: '1',
    //   blogName: 'blogName',
    // },
  ],
};
