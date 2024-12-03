import { IBaseQuery } from '../base-query';
import { IUserDB } from './user';

export interface GetAllUsersQuery extends IBaseQuery<IUserDB> {
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
}