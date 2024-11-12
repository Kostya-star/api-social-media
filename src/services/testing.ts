import { mockDB } from '@/mockDB';

const deleteAllData = (): void => {
  try {
    mockDB.blogs = [];
    mockDB.posts = [];
  } catch (err) {
    throw err;
  }
};

export default {
  deleteAllData,
};
