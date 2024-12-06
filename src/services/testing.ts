import { BlogModel } from '@/DB/models/blogs-model';
import { CommentModel } from '@/DB/models/comments-model';
import { SessionModel } from '@/DB/models/devices-model';
import { PostModel } from '@/DB/models/posts-model';
import { ReqRateModel } from '@/DB/models/req-rate-model';
import { UserModel } from '@/DB/models/users-model';

const deleteAllData = async (): Promise<void> => {
  try {
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await SessionModel.deleteMany({});
    await CommentModel.deleteMany({});
    await ReqRateModel.deleteMany({});
  } catch (err) {
    throw err;
  }
};

export default {
  deleteAllData,
};
