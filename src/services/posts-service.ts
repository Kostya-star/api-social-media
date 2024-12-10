import { ICreatePostBody } from '@/types/posts/createPostBody';
import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { ErrorService } from './error-service';
import { PostsErrorsList } from '@/errors/posts-errors';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ObjectId } from 'mongodb';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { PostsRepositoryCommands } from '@/repositories/posts/posts-repository-commands';
import { BlogsRepositoryCommands } from '@/repositories/blogs/blogs-repository-commands';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/composition-root-types';

@injectable()
export class PostsService {
  protected postsRepository: PostsRepositoryCommands;
  protected blogsRepository: BlogsRepositoryCommands;

  constructor(
    @inject(TYPES.postsRepositoryCommands) postsRepository: PostsRepositoryCommands,
    @inject(TYPES.blogsRepositoryCommands) blogsRepository: BlogsRepositoryCommands
  ) {
    this.postsRepository = postsRepository;
    this.blogsRepository = blogsRepository;
  }

  async createPost(post: ICreatePostBody): Promise<MongooseObjtId> {
    // no errors should occur here coz previusly it was assured the post.blogId should exist and be valid
    const blogName = (await this.blogsRepository.getBlogById(post.blogId))!.name;

    const newPost: ICreatePostBody & { blogName: string } = { ...post, blogName };
    return await this.postsRepository.createPost(newPost);
  }

  async updatePost(postId: MongooseObjtId, newPost: IUpdatePostBody): Promise<void> {
    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const postToUpdate = await this.postsRepository.getPostById(postId);

    if (!postToUpdate) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await this.postsRepository.updatePost(postId, newPost);
  }

  async deletePost(postId: MongooseObjtId): Promise<void> {
    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const postToDelete = await this.postsRepository.getPostById(postId);

    if (!postToDelete) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await this.postsRepository.deletePost(postId);
  }
}
