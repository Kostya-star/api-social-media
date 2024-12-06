import { BlogModel } from '@/DB/models/blogs-model';
import { IBlogDB } from '@/types/blogs/blog';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { MongooseObjtId } from '@/types/mongoose-object-id';

const getBlogById = async (blogId: MongooseObjtId): Promise<IBlogDB | null> => {
  // return await BlogModel.findOne({ _id: blogId});
  return await BlogModel.findById(blogId);
};

const createBlog = async (newBlog: ICreateBlogPayload): Promise<MongooseObjtId> => {
  const blog = await BlogModel.create(newBlog);
  return blog._id;
};

const updateBlog = async (blogId: MongooseObjtId, updates: IUpdateBlogPayload): Promise<void> => {
  // await BlogModel.updateOne({ _id: blogId }, updates);
  await BlogModel.findOneAndUpdate({ _id: blogId }, updates);
};

const deleteBlog = async (blogId: MongooseObjtId): Promise<void> => {
  await BlogModel.deleteOne({ _id: blogId });
};

export default {
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
