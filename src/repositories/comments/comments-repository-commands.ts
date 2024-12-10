import { CommentModel } from '@/DB/models/comments-model';
import { ICommentDB } from '@/types/comments/comment';
import { ICommentPayload } from '@/types/comments/commentPayload';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { injectable } from 'inversify';

@injectable()
export class CommentsRepositoryCommands {
  async getCommentById(commentId: MongooseObjtId): Promise<ICommentDB | null> {
    return await CommentModel.findOne({ _id: commentId });
  }

  async createComment(postComment: ICommentPayload): Promise<MongooseObjtId> {
    const comment = await CommentModel.create(postComment);
    return comment._id;
  }

  async updateComment(commentId: MongooseObjtId, updates: { content: string }): Promise<void> {
    await CommentModel.updateOne({ _id: commentId }, updates);
  }

  async deleteComment(commentId: MongooseObjtId): Promise<void> {
    await CommentModel.deleteOne({ _id: commentId });
  }
}
