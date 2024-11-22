import { blogsCollection } from '@/DB';
import { IBaseResponse } from '@/types/base-response';
import { IBlog } from '@/types/blogs/blog';
import { GetAllBlogsQuery } from '@/types/blogs/getAllBlogsQuery';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { blogObjMapper } from '@/util/blogObjMapper';
import { buildQuery } from '@/util/buildQuery';
import { ObjectId, WithId} from 'mongodb';

const getAllBlogs = async ({ pageNumber, pageSize, searchNameTerm, sortBy, sortDirection }: Required<GetAllBlogsQuery>): Promise<IBaseResponse<WithId<IBlog>>> => {
  const { sortOptions, skip, limit } = buildQuery<IBlog>({ pageNumber, pageSize, sortBy, sortDirection });

  const query = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

  const items = await blogsCollection.find(query).sort(sortOptions).skip(skip).limit(limit).toArray();

  const totalCount = await blogsCollection.countDocuments(query);
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
};

const getBlogById = async (blogId: ObjectId): Promise<WithId<IBlog> | null> => {
  return await blogsCollection.findOne({ _id: new ObjectId(blogId) });
};

const createBlog = async (newBlog: IBlog): Promise<WithId<IBlog>> => {
  const res = await blogsCollection.insertOne(newBlog);
  return { ...newBlog, _id: res.insertedId };
};

const updateBlog = async (blogId: ObjectId, newBlog: IUpdateBlogPayload): Promise<void> => {
  await blogsCollection.updateOne({ _id: new ObjectId(blogId) }, { $set: newBlog });
};

const deleteBlog = async (blogId: ObjectId): Promise<void> => {
  await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
