import { UserModel } from '@/DB/models/users-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { IUserDB } from '@/types/users/user';
import { RootFilterQuery } from 'mongoose';

const getUserById = async (userId: MongooseObjtId): Promise<IUserDB | null> => {
  return await UserModel.findOne({ _id: userId });
};

const findUserByFilter = async (filter: RootFilterQuery<IUserDB>): Promise<IUserDB | null> => {
  return await UserModel.findOne(filter);
};

const createUser = async (newUser: Partial<IUserDB>): Promise<MongooseObjtId> => {
  const user = await UserModel.create(newUser);
  return user._id;
};

const updateUserById = async (userId: MongooseObjtId, updates: Partial<IUserDB>): Promise<void> => {
  // console.log('updates', updates)
  await UserModel.updateOne({ _id: userId }, updates);
};

const deleteUser = async (userId: MongooseObjtId): Promise<void> => {
  await UserModel.deleteOne({ _id: userId });
};

export default {
  getUserById,
  createUser,
  updateUserById,
  findUserByFilter,
  deleteUser,
};
