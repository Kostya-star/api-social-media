import { BlogModel } from '@/models/blogs-model';
import { CommentModel } from '@/models/comments-model';
import { SessionModel } from '@/models/devices-model';
import { PostModel } from '@/models/posts-model';
import { ReqRateModel } from '@/models/req-rate-model';
import { UserModel } from '@/models/users-model';

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
