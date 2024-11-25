import { usersCollection } from '@/DB';
import { IBaseResponse } from '@/types/base-response';
import { GetAllUsersQuery } from '@/types/users/getAllUsersQuery';
import { IUser } from '@/types/users/user';
import { buildQuery } from '@/util/buildQuery';
import { Filter, ObjectId, WithId } from 'mongodb';

const getAllUsers = async (query: Required<GetAllUsersQuery>): Promise<IBaseResponse<WithId<IUser>>> => {
  const { searchEmailTerm, searchLoginTerm, pageNumber, pageSize, sortBy, sortDirection } = query;
  const { sortOptions, skip, limit } = buildQuery<IUser>({ pageNumber, pageSize, sortBy, sortDirection });

  const searchConditions = [];

  if (searchLoginTerm) {
    searchConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
  }

  if (searchEmailTerm) {
    searchConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
  }

  const queryFilter = searchConditions.length ? { $or: searchConditions } : {};

  const items = await usersCollection.find(queryFilter).sort(sortOptions).skip(skip).limit(limit).toArray();

  const totalCount = await usersCollection.countDocuments(queryFilter);
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
};

const getUserById = async (userId: ObjectId): Promise<WithId<IUser> | null> => {
  return await usersCollection.findOne({ _id: new ObjectId(userId) });
};

const findUserByFilter = async (filter: Filter<IUser>): Promise<WithId<IUser> | null> => {
  return await usersCollection.findOne(filter);
};

const createUser = async (newUser: IUser): Promise<WithId<IUser>> => {
  const res = await usersCollection.insertOne(newUser);
  return { ...newUser, _id: res.insertedId };
};

const updateUserById = async (userId: ObjectId, newUser: Partial<IUser>): Promise<void> => {
  await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: newUser });
};

const deleteUser = async (userId: ObjectId): Promise<void> => {
  await usersCollection.deleteOne({ _id: new ObjectId(userId) });
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  findUserByFilter,
  deleteUser,
};
