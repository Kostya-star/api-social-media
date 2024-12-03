import { SORT_DIRECTIONS } from '@/const/sort-directions';
import { IBaseQuery } from '@/types/base-query';
import { SortOrder } from 'mongoose';

export function buildQuery<T>({ pageNumber, pageSize, sortBy, sortDirection }: Required<IBaseQuery<T>>) {
  const skip = (pageNumber - 1) * pageSize;
  const limit = pageSize;

  const sortOptions = { [sortBy]: (sortDirection === SORT_DIRECTIONS.ASC ? 1 : -1) as SortOrder };

  return {
    sortOptions,
    skip,
    limit,
  };
}
