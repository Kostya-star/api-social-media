import { IBlog } from './blog';

export interface GetAllBlogsQuery {
  searchNameTerm?: string | null;
  sortBy?: keyof IBlog;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}
