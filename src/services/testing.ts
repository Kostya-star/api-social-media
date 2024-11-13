import { blogsCollection, postsCollection } from '@/DB';

const deleteAllData = async (): Promise<void> => {
  try {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
  } catch (err) {
    throw err;
  }
};

export default {
  deleteAllData,
};
