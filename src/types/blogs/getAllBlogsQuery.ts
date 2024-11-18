import { IBaseQuery } from '../base-query';
import { IBlog } from './blog';

export interface GetAllBlogsQuery extends IBaseQuery<IBlog> {
  searchNameTerm?: string | null;
}
