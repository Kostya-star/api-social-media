import { IBlog } from '@/types/blogs/blog';
import { IPost } from '@/types/posts/post';
import { MongoClient } from 'mongodb';
import { CollectionsNames, DatabasesNames } from './config';
import { IUser } from '@/types/users/user';

const MONGO_URI = process.env.MONGO_URI || '';
const mongoClient = new MongoClient(MONGO_URI);

export const db = mongoClient.db(DatabasesNames.INCUBATOR_BLOGS);
export const blogsCollection = db.collection<IBlog>(CollectionsNames.BLOGS);
export const postsCollection = db.collection<IPost>(CollectionsNames.POSTS);
export const usersCollection = db.collection<IUser>(CollectionsNames.USERS);

export async function connectToDb() {
  try {
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.log('Could not connect to MongoDB!');
    console.error(err);
    // await mongoClient.close();
  }
}
// connectToDb().then(() => {}).catch(console.dir);
