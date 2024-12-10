import { BlogModel } from '@/DB/models/blogs-model';
import { IBlogDB } from '@/types/blogs/blog';
import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { injectable } from 'inversify';

@injectable()
export class BlogsRepositoryCommands {
  async getBlogById(blogId: MongooseObjtId): Promise<IBlogDB | null> {
    // return await BlogModel.findOne({ _id: blogId});
    return await BlogModel.findById(blogId);
  }

  async createBlog(newBlog: ICreateBlogPayload): Promise<MongooseObjtId> {
    const blog = await BlogModel.create(newBlog);
    return blog._id;
  }

  async updateBlog(blogId: MongooseObjtId, updates: IUpdateBlogPayload): Promise<void> {
    // await BlogModel.updateOne({ _id: blogId }, updates);
    await BlogModel.findOneAndUpdate({ _id: blogId }, updates);
  }

  async deleteBlog(blogId: MongooseObjtId): Promise<void> {
    await BlogModel.deleteOne({ _id: blogId });
  }
}
