import { usersCollection } from '@/DB';
import { IBaseResponse } from '@/types/base-response';
import { GetAllUsersQuery } from '@/types/users/getAllUsersQuery';
import { IUser } from '@/types/users/user';
import { blogObjMapper } from '@/util/blogObjMapper';
import { buildQuery } from '@/util/buildQuery';
import { userObjMapper } from '@/util/userObjMapper';
import { Filter, ObjectId, WithId} from 'mongodb';

const getAllUsers = async (query: Required<GetAllUsersQuery>): Promise<IBaseResponse<IUser>> => {
  const { searchEmailTerm, searchLoginTerm, pageNumber, pageSize, sortBy, sortDirection } = query;
  const { sortOptions, skip, limit } = buildQuery<IUser>({ pageNumber, pageSize, sortBy, sortDirection });

  const searchConditions: Partial<Record<'login' | 'email', any>> = {};

  if (searchLoginTerm) {
    searchConditions.login = { $regex: searchLoginTerm, $options: 'i' };
  }

  if (searchEmailTerm) {
    searchConditions.email = { $regex: searchEmailTerm, $options: 'i' };
  }

  const users = await usersCollection.find(searchConditions).sort(sortOptions).skip(skip).limit(limit).toArray();

  const totalCount = await usersCollection.countDocuments(searchConditions);
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items: users.map(userObjMapper),
  };
};

const createUser = async (newUser: IUser): Promise<IUser> => {
  const res = await usersCollection.insertOne(newUser);
  return userObjMapper({ ...newUser, _id: res.insertedId });
};

const deleteUser = async (userId: ObjectId): Promise<void> => {
  await usersCollection.deleteOne({ _id: new ObjectId(userId) });
};

const findUserByFilter = async (filter: Filter<IUser>): Promise<WithId<IUser> | null> => {
  const user = await usersCollection.findOne(filter);
  return user;
}

export default {
  getAllUsers,
  createUser,
  findUserByFilter,
  deleteUser,
};
