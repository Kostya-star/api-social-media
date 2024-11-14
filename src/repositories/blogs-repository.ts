import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { blogsCollection } from '@/DB';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { ErrorService } from '@/services/error-service';
import { IBlog } from '@/types/blogs/blog';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { v4 as uuidv4 } from 'uuid';

const getAllBlogs = async (): Promise<IBlog[]> => {
  // exclude _id prop
  return await blogsCollection.find({}, { projection: { _id: 0 } }).toArray();
};

const getBlogById = async (blogId: string): Promise<IBlog> => {
  // if (!ObjectId.isValid(blogId)) {
  //   throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  // }

  const blog = await blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } });

  if (!blog) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  return blog;
};

const createBlog = async (blog: ICreateBlogPayload): Promise<IBlog> => {
  const newBlog: IBlog = { ...blog, id: uuidv4(), isMembership: false, createdAt: new Date() };
  await blogsCollection.insertOne({ ...newBlog }); // Create a copy to avoid mutation
  return { ...newBlog }; // Return a copy to ensure no _id is included
};

const updateBlog = async (blogId: string, newBlog: IUpdateBlogPayload): Promise<void> => {
  // if (!ObjectId.isValid(blogId)) {
  //   throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  // }

  const blogToUpdate = await blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } });

  if (!blogToUpdate) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await blogsCollection.updateOne({ id: blogId }, { $set: newBlog });
};

const deleteBlog = async (blogId: string): Promise<void> => {
  // if (!ObjectId.isValid(blogId)) {
  //   throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  // }

  // const blogToDelete = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
  const blogToDelete = await blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } });

  if (!blogToDelete) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  await blogsCollection.deleteOne({ id: blogId });
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
