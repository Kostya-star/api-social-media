import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { blogsCollection } from '@/DB';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { ErrorService } from '@/services/error-service';
import { IBlog } from '@/types/blogs/blog';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { blogObjMapper } from '@/util/blogObjMapper';
import { ObjectId } from 'mongodb';

const getAllBlogs = async (): Promise<IBlog[]> => {
  const blogs = await blogsCollection.find({}).toArray();
  return blogs.map(blogObjMapper); 
};

const getBlogById = async (blogId: ObjectId): Promise<IBlog> => {
  if (!ObjectId.isValid(blogId)) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

  if (!blog) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  return blogObjMapper(blog)
};

const createBlog = async (blog: ICreateBlogPayload): Promise<IBlog> => {
  const newBlog: IBlog = { ...blog, isMembership: false, createdAt: new Date() };
  const res = await blogsCollection.insertOne(newBlog);
  return blogObjMapper({...newBlog, _id: res.insertedId});
};

const updateBlog = async (blogId: ObjectId, newBlog: IUpdateBlogPayload): Promise<void> => {
  if (!ObjectId.isValid(blogId)) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const blogToUpdate = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

  if (!blogToUpdate) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await blogsCollection.updateOne({ _id: new ObjectId(blogId) }, { $set: newBlog });
};

const deleteBlog = async (blogId: ObjectId): Promise<void> => {
  if (!ObjectId.isValid(blogId)) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const blogToDelete = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

  if (!blogToDelete) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
