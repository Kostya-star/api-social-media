// import { IBlog } from '@/types/blogs/blog';
// import { IPost } from '@/types/posts/post';

// interface MockDB {
//   blogs: IBlog[];
//   posts: IPost[];
// }

// export const mockDB: MockDB = {
//   blogs: [
//     // {
//     //   id: '1',
//     //   name: 'blogName',
//     //   description: 'dsdsd',
//     //   websiteUrl: 'dsdsd',
//     // },
//   ],
//   posts: [
//     // {
//     //   id: '1',
//     //   title: 'sdsds',
//     //   shortDescription: 'dsdsd',
//     //   content: 'sdsds',
//     //   blogId: '1',
//     //   blogName: 'blogName',
//     // },
//   ],
// };

import { IBlog } from '@/types/blogs/blog';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IPost } from '@/types/posts/post';
import { Collection, MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb+srv://konstantindanilov19:1qa2ws3ed@incubator-blogs.8ax2g.mongodb.net/?retryWrites=true&w=majority&appName=incubator-blogs';
const client = new MongoClient(MONGO_URI);

const db = client.db('incubator-blogs');
export const blogsCollection = db.collection<IBlog>('blogs');
export const postsCollection = db.collection<IPost>('posts');

export async function connectToDb() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.log('Could not connect to MongoDB!');
    console.error(err);
    // await client.close();
  }
}
connectToDb().catch(console.dir);
