import { IBlog } from '@/types/blogs/blog';
import { ErrorService } from './error-service';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { HTTP_STATUS_CODES } from '@/settings/http-status-codes';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { v4 as uuidv4 } from 'uuid';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { blogsCollection } from '@/DB';

const getAllBlogs = async (): Promise<IBlog[]> => {
  try {
    const blogs = await blogsCollection.find().toArray()
    return blogs;
  } catch (err) {
    throw err;
  }
};

// const getBlogById = (blogId: string): IBlog => {
//   try {
//     const blog = mockDB.blogs.find((b) => b.id === blogId);

//     if (!blog) {
//       throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
//     }

//     return blog;
//   } catch (err) {
//     throw err;
//   }
// };

const createBlog = async (blog: ICreateBlogPayload): Promise<IBlog> => {
  const newBlog: IBlog = {
    ...blog,
    id: uuidv4(),
  };

  try {
    await blogsCollection.insertOne(newBlog);

    // mockDB.blogs.push(newBlog);
    return newBlog;
  } catch (err) {
    throw err;
  }
};

// const updateBlog = (blogId: string, newBlog: IUpdateBlogPayload): void => {
//   const blogToUpdate = mockDB.blogs.find((b) => b.id === blogId);

//   if (!blogToUpdate) {
//     throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
//   }

//   try {
//     blogToUpdate.name = newBlog.name;
//     blogToUpdate.description = newBlog.description;
//     blogToUpdate.websiteUrl = newBlog.websiteUrl;
//   } catch (err) {
//     throw err;
//   }
// };

// const deleteBlog = (blogId: string): void => {
//   const blogToDelete = mockDB.blogs.find((b) => b.id === blogId);

//   if (!blogToDelete) {
//     throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
//   }

//   try {
//     mockDB.blogs = mockDB.blogs.filter((b) => b.id !== blogId);
//   } catch (err) {
//     throw err;
//   }
// };

export default {
  getAllBlogs,
  // getBlogById,
  createBlog,
  // updateBlog,
  // deleteBlog,
};
