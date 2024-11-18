export interface IBaseQuery<T> {
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}
