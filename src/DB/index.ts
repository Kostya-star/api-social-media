import { IBlog } from '@/types/blogs/blog';
import { IPost } from '@/types/posts/post';
import { MongoClient, ObjectId } from 'mongodb';
import { CollectionsNames, DatabasesNames } from './config';
import { IUser } from '@/types/users/user';
import { IComment } from '@/types/comments/comment';
import { ISession } from '@/types/sessions/session';
import { IReqRateLimiter } from '@/types/req-rate-limiter';

const MONGO_URI = process.env.MONGO_URI || '';
const mongoClient = new MongoClient(MONGO_URI);

export const db = mongoClient.db(DatabasesNames.INCUBATOR_BLOGS);
export const blogsCollection = db.collection<IBlog>(CollectionsNames.BLOGS);
export const postsCollection = db.collection<IPost>(CollectionsNames.POSTS);
export const usersCollection = db.collection<IUser>(CollectionsNames.USERS);
export const commentsCollection = db.collection<IComment>(CollectionsNames.COMMENTS);
export const sessionsCollection = db.collection<ISession>(CollectionsNames.SESSIONS);
export const requestsRateCollection = db.collection<IReqRateLimiter>(CollectionsNames.REQUESTS_RATE);

// should be deleted!
export const revokedTokensCollection = db.collection<{ _id?: ObjectId; token: string }>(CollectionsNames.REVOKED_TOKENS);

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
