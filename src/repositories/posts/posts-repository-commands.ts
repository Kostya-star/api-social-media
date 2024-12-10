import { IUpdatePostBody } from '@/types/posts/updatePostBody';
import { IPostDB } from '@/types/posts/post';
import { PostModel } from '@/DB/models/posts-model';
import { ICreatePostBody } from '@/types/posts/createPostBody';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { injectable } from 'inversify';

@injectable()
export class PostsRepositoryCommands {
  async getPostById(postId: MongooseObjtId): Promise<IPostDB | null> {
    return await PostModel.findOne({ _id: postId });
  }

  async createPost(newPost: ICreatePostBody & { blogName: string }): Promise<MongooseObjtId> {
    const post = await PostModel.create(newPost);
    return post._id;
  }

  async updatePost(postId: MongooseObjtId, updates: IUpdatePostBody): Promise<void> {
    await PostModel.updateOne({ _id: postId }, updates);
  }

  async deletePost(postId: MongooseObjtId): Promise<void> {
    await PostModel.deleteOne({ _id: postId });
  }
}
