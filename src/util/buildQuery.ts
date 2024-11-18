import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { IBaseQuery } from '@/types/base-query';
import { Sort } from 'mongodb';

type Query<T> = Required<IBaseQuery<T>> & { searchNameTerm?: string | null, searchByKey?: string }

export function buildQuery<T>({ pageNumber, pageSize, searchNameTerm, sortBy, sortDirection, searchByKey }: Query<T>) {
  const skip = (pageNumber - 1) * pageSize;
  const limit = pageSize;

  const query = (searchNameTerm && searchByKey) ? { [searchByKey as string]: { $regex: searchNameTerm, $options: 'i' } } : {};
  const sortOptions = { [sortBy]: sortDirection === SORT_DIRECTIONS.ASC ? 1 : -1 } as Sort;

  return {
    query,
    sortOptions,
    skip,
    limit,
  };
}
