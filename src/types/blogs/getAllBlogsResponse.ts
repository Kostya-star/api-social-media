import { IBlog } from './blog';

export interface GetAllBlogsResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IBlog[];
}
