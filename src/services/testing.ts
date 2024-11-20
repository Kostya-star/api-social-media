import { blogsCollection, postsCollection, usersCollection } from '@/DB';

const deleteAllData = async (): Promise<void> => {
  try {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
  } catch (err) {
    throw err;
  }
};

export default {
  deleteAllData,
};
