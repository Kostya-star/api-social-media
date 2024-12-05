import { IUserDB, IUserView } from '@/types/users/user';

export function userObjMapper(user: IUserDB): IUserView {
  return {
    id: user._id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
}
