import { UserModel } from '@/DB/models/users-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { IUserDB } from '@/types/users/user';
import { RootFilterQuery } from 'mongoose';

export class UsersRepositoryCommands {
  async getUserById(userId: MongooseObjtId): Promise<IUserDB | null> {
    return await UserModel.findOne({ _id: userId });
  }

  async findUserByFilter(filter: RootFilterQuery<IUserDB>): Promise<IUserDB | null> {
    return await UserModel.findOne(filter);
  }

  async createUser(newUser: Partial<IUserDB>): Promise<MongooseObjtId> {
    const user = await UserModel.create(newUser);
    return user._id;
  }

  async updateUserById(userId: MongooseObjtId, updates: Partial<IUserDB>): Promise<void> {
    // console.log('updates', updates)
    await UserModel.updateOne({ _id: userId }, updates);
  }

  async deleteUser(userId: MongooseObjtId): Promise<void> {
    await UserModel.deleteOne({ _id: userId });
  }
}
