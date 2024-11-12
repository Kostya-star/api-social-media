// import { mockDB } from '@/DB';

const deleteAllData = (): void => {
  try {
    // mockDB.blogs = [];
    // mockDB.posts = [];
  } catch (err) {
    throw err;
  }
};

export default {
  deleteAllData,
};
