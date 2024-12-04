import { UserModel } from '@/models/users-model';
import { IBaseResponse } from '@/types/base-response';
import { IEmailConfirmationBody } from '@/types/users/email-confirmation-body';
import { GetAllUsersQuery } from '@/types/users/getAllUsersQuery';
import { IUserDB } from '@/types/users/user';
import { buildQuery } from '@/util/buildQuery';
import { RootFilterQuery, Types } from 'mongoose';

type MObjectId = Types.ObjectId;

const getAllUsers = async (query: Required<GetAllUsersQuery>): Promise<IBaseResponse<IUserDB>> => {
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
    items,
  };
};

const getUserById = async (userId: MObjectId): Promise<IUserDB | null> => {
  return await UserModel.findOne({ _id: userId });
};

const findUserByFilter = async (filter: RootFilterQuery<IUserDB>): Promise<IUserDB | null> => {
  return await UserModel.findOne(filter);
};

const createUser = async (newUser: Partial<IUserDB>): Promise<IUserDB> => {
  return await UserModel.create(newUser);
};

const updateUserById = async (userId: MObjectId, updates: Partial<IUserDB>): Promise<void> => {
  // console.log('updates', updates)
  await UserModel.updateOne({ _id: userId }, updates);
};

const deleteUser = async (userId: MObjectId): Promise<void> => {
  await UserModel.deleteOne({ _id: userId });
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  findUserByFilter,
  deleteUser,
};
