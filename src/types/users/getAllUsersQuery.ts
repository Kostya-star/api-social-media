import { IBaseQuery } from '../base-query';
import { IUser } from './user';

export interface GetAllUsersQuery extends IBaseQuery<IUser> {
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
}