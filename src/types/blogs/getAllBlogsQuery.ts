import { IBaseQuery } from '../base-query';
import { IBlogDB } from './blog';

export interface GetAllBlogsQuery extends IBaseQuery<IBlogDB> {
  searchNameTerm?: string | null;
}
