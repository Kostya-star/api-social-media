import { SORT_DIRECTIONS } from '@/const/sort-directions';

export interface IBaseQuery<T> {
  sortBy?: keyof T;
  sortDirection?: SORT_DIRECTIONS;
  pageNumber?: number;
  pageSize?: number;
}
