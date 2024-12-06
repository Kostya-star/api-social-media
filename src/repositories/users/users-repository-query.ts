import { UserModel } from '@/DB/models/users-model';
import { IBaseResponse } from '@/types/base-response';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { GetAllUsersQuery } from '@/types/users/getAllUsersQuery';
import { IUserDB, IUserView } from '@/types/users/user';
import { buildQuery } from '@/util/buildQuery';
import { userObjMapper } from '@/util/mappers/userObjMapper';

const getAllUsers = async (query: Required<GetAllUsersQuery>): Promise<IBaseResponse<IUserView>> => {
  const { searchEmailTerm, searchLoginTerm, pageNumber, pageSize, sortBy, sortDirection } = query;
  const { sortOptions, skip, limit } = buildQuery<IUserDB>({ pageNumber, pageSize, sortBy, sortDirection });

  const searchConditions = [];

  if (searchLoginTerm) {
    searchConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
  }

  if (searchEmailTerm) {
    searchConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
  }

  const queryFilter = searchConditions.length ? { $or: searchConditions } : {};

  const items = await UserModel.find(queryFilter).sort(sortOptions).skip(skip).limit(limit);

  const totalCount = await UserModel.countDocuments(queryFilter);
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(userObjMapper),
  };
};

const getUserById = async (userId: MongooseObjtId): Promise<IUserView | null> => {
  const user = await UserModel.findOne({ _id: userId });
  return user ? userObjMapper(user) : null;
};

export default {
  getAllUsers,
  getUserById,
};
