import { BlogModel } from '@/DB/models/blogs-model';
import { IBaseResponse } from '@/types/base-response';
import { IBlogDB, IBlogView } from '@/types/blogs/blog';
import { GetAllBlogsQuery } from '@/types/blogs/getAllBlogsQuery';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { buildQuery } from '@/util/buildQuery';
import { blogObjMapper } from '@/util/mappers/blogObjMapper';

const getAllBlogs = async ({ pageNumber, pageSize, searchNameTerm, sortBy, sortDirection }: Required<GetAllBlogsQuery>): Promise<IBaseResponse<IBlogView>> => {
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
    items: items.map(blogObjMapper),
  };
};

const getBlogById = async (blogId: MongooseObjtId): Promise<IBlogView | null> => {
  // return await BlogModel.findOne({ _id: blogId});
  const blog = await BlogModel.findById(blogId);
  return blog ? blogObjMapper(blog) : null;
};

export default {
  getAllBlogs,
  getBlogById,
};
