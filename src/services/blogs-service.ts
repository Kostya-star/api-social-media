import { IBlog } from '@/types/blogs/blog';
import { ErrorService } from './error-service';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { blogsCollection } from '@/DB';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const getAllBlogs = async (): Promise<IBlog[]> => {
  try {
    // exclude _id prop
    const blogs = await blogsCollection.find({}, { projection: { _id: 0 } }).toArray();
    return blogs;
  } catch (err) {
    throw err;
  }
};

const getBlogById = async (blogId: string): Promise<IBlog> => {
  try {
    // if (!ObjectId.isValid(blogId)) {
    //   throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    // }

    // exclude _id prop
    const blog = await blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } });

    if (!blog) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    return blog;
  } catch (err) {
    throw err;
  }
};

const createBlog = async (blog: ICreateBlogPayload): Promise<IBlog> => {
  try {
    const newBlog: IBlog = { ...blog, id: uuidv4(), isMembership: false, createdAt: new Date() };
    await blogsCollection.insertOne({ ...newBlog }); // Create a copy to avoid mutation
    return { ...newBlog }; // Return a copy to ensure no _id is included
  } catch (err) {
    throw err;
  }
};

const updateBlog = async (blogId: string, newBlog: IUpdateBlogPayload): Promise<void> => {
  try {
    // if (!ObjectId.isValid(blogId)) {
    //   throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    // }

    const blogToUpdate = await blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } });

    if (!blogToUpdate) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await blogsCollection.updateOne({ id: blogId }, { $set: newBlog });
  } catch (err) {
    throw err;
  }
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

  try {
    await blogsCollection.deleteOne({ id: blogId });
  } catch (err) {
    throw err;
  }
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
