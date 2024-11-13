import { IBlog } from '@/types/blogs/blog';
import { ErrorService } from './error-service';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { blogsCollection } from '@/DB';
import { ObjectId } from 'mongodb';

const getAllBlogs = async (): Promise<IBlog[]> => {
  try {
    const blogs = await blogsCollection.find({}).toArray();
    return blogs;
  } catch (err) {
    throw err;
  }
};

const getBlogById = async (blogId: ObjectId): Promise<IBlog> => {
  try {
    if (!ObjectId.isValid(blogId)) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

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
    const newBlog: IBlog = { ...blog, isMembership: false, createdAt: new Date() }
    const res = await blogsCollection.insertOne(newBlog);
    return { ...newBlog, _id: res.insertedId };
  } catch (err) {
    throw err;
  }
};

const updateBlog = async (blogId: ObjectId, newBlog: IUpdateBlogPayload): Promise<void> => {
  try {
    if (!ObjectId.isValid(blogId)) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blogToUpdate = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blogToUpdate) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await blogsCollection.updateOne({ _id: new ObjectId(blogId) }, { $set: newBlog });
  } catch (err) {
    throw err;
  }
};

const deleteBlog = async (blogId: ObjectId): Promise<void> => {
  if (!ObjectId.isValid(blogId)) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }
  
  const blogToDelete = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

  if (!blogToDelete) {
    throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  try {
    await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
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
