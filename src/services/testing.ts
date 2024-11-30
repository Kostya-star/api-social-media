import { blogsCollection, commentsCollection, postsCollection, sessionsCollection, usersCollection } from '@/DB';

const deleteAllData = async (): Promise<void> => {
  try {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await sessionsCollection.deleteMany({});
    await commentsCollection.deleteMany({});
  } catch (err) {
    throw err;
  }
};

export default {
  deleteAllData,
};
