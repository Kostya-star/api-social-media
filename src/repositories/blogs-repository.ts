import { blogsCollection } from '@/DB';
import { IBlog } from '@/types/blogs/blog';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { blogObjMapper } from '@/util/blogObjMapper';
import { ObjectId } from 'mongodb';

const getAllBlogs = async (): Promise<IBlog[]> => {
  const blogs = await blogsCollection.find({}).toArray();
  return blogs.map(blogObjMapper); 
};

const getBlogById = async (blogId: ObjectId): Promise<IBlog | null> => {
  const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
  return blog ? blogObjMapper(blog) : null;
};

const createBlog = async (newBlog: IBlog): Promise<IBlog> => {
  const res = await blogsCollection.insertOne(newBlog);
  return blogObjMapper({...newBlog, _id: res.insertedId});
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
