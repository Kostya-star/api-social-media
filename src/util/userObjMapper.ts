import { IUser } from '@/types/users/user';
import { ObjectId } from 'mongodb';

type UserMongo = IUser & { _id: ObjectId };

// map the response and get rid of _id
export function userObjMapper(user: UserMongo): IUser {
  return {
    id: user._id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
}
