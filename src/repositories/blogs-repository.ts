import { BlogModel } from '@/models/blogs-model';
import { IBaseResponse } from '@/types/base-response';
import { IBlogDB } from '@/types/blogs/blog';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { GetAllBlogsQuery } from '@/types/blogs/getAllBlogsQuery';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { buildQuery } from '@/util/buildQuery';
import { Types } from 'mongoose';

type ObjectId = Types.ObjectId;

const getAllBlogs = async ({ pageNumber, pageSize, searchNameTerm, sortBy, sortDirection }: Required<GetAllBlogsQuery>): Promise<IBaseResponse<IBlogDB>> => {
  const { sortOptions, skip, limit } = buildQuery<IBlogDB>({ pageNumber, pageSize, sortBy, sortDirection });

  const query = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

  const items = await BlogModel.find(query).sort(sortOptions).skip(skip).limit(limit);

  const totalCount = await BlogModel.countDocuments(query);
  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
};

const getBlogById = async (blogId: ObjectId): Promise<IBlogDB | null> => {
  // return await BlogModel.findOne({ _id: blogId});
  return await BlogModel.findById(blogId);
};

const createBlog = async (newBlog: ICreateBlogPayload): Promise<IBlogDB> => {
  return await BlogModel.create(newBlog);
};

const updateBlog = async (blogId: ObjectId, updates: IUpdateBlogPayload): Promise<void> => {
  // await BlogModel.updateOne({ _id: blogId }, updates);
  await BlogModel.findOneAndUpdate({ _id: blogId }, updates);
};

const deleteBlog = async (blogId: ObjectId): Promise<void> => {
  await BlogModel.deleteOne({ _id: blogId });
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
