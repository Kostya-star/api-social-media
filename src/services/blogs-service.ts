import { ICreateBlogPayload } from '@/types/blogs/createBlogBody';
import { IUpdateBlogPayload } from '@/types/blogs/updateBlogBody';
import { ObjectId } from 'mongodb';
import { ErrorService } from './error-service';
import { BlogsErrorsList } from '@/errors/blogs-errors';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { BlogsRepositoryCommands } from '@/repositories/blogs/blogs-repository-commands';

export class BlogsService {
  protected blogsRepository;

  constructor(blogsRepository: BlogsRepositoryCommands) {
    this.blogsRepository = blogsRepository;
  }

  async createBlog(blog: ICreateBlogPayload): Promise<MongooseObjtId> {
    return await this.blogsRepository.createBlog(blog);
  }

  async updateBlog(blogId: MongooseObjtId, newBlog: IUpdateBlogPayload): Promise<void> {
    if (!ObjectId.isValid(blogId)) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blogToUpdate = await this.blogsRepository.getBlogById(blogId);

    if (!blogToUpdate) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await this.blogsRepository.updateBlog(blogId, newBlog);
  }

  async deleteBlog(blogId: MongooseObjtId): Promise<void> {
    if (!ObjectId.isValid(blogId)) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const blogToDelete = await this.blogsRepository.getBlogById(blogId);

    if (!blogToDelete) {
      throw ErrorService(BlogsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await this.blogsRepository.deleteBlog(blogId);
  }
}
