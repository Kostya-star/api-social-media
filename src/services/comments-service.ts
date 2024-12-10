import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { ObjectId } from 'mongodb';
import { CommentsErrorsList } from '@/errors/comments-errors';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ICommentPayload } from '@/types/comments/commentPayload';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { CommentsRepositoryCommands } from '@/repositories/comments/comments-repository-commands';
import { PostsRepositoryCommands } from '@/repositories/posts/posts-repository-commands';
import { UsersRepositoryCommands } from '@/repositories/users/users-repository-commands';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/composition-root-types';

@injectable()
export class CommentsService {
  protected commentsRepository;
  protected postsRepository;
  protected usersRepository;

  constructor(
    @inject(TYPES.commentsRepositoryCommands) commentsRepository: CommentsRepositoryCommands,
    @inject(TYPES.postsRepositoryCommands) postsRepository: PostsRepositoryCommands,
    @inject(TYPES.usersRepositoryCommands) usersRepository: UsersRepositoryCommands
  ) {
    this.commentsRepository = commentsRepository;
    this.postsRepository = postsRepository;
    this.usersRepository = usersRepository;
  }

  createCommentForPost = async (postId: MongooseObjtId, newComment: { content: string }, userId: MongooseObjtId): Promise<MongooseObjtId> => {
    if (!ObjectId.isValid(postId)) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const userInfo = await this.usersRepository.findUserByFilter({ _id: userId });

    const postComment: ICommentPayload & { postId: MongooseObjtId } = {
      content: newComment.content,
      postId,
      commentatorInfo: {
        userId,
        userLogin: userInfo!.login,
      },
    };

    return await this.commentsRepository.createComment(postComment);
  };

  updateComment = async (commentId: MongooseObjtId, newComment: { content: string }, currentUserId: MongooseObjtId): Promise<void> => {
    if (!ObjectId.isValid(commentId)) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const commentToUpdate = await this.commentsRepository.getCommentById(commentId);

    if (!commentToUpdate) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    // both .toString() ?
    const isOwner = currentUserId.toString() === commentToUpdate.commentatorInfo.userId.toString();

    if (!isOwner) {
      throw ErrorService(HTTP_ERROR_MESSAGES.FORBIDDEN_403, HTTP_STATUS_CODES.FORBIDDEN_403);
    }

    await this.commentsRepository.updateComment(commentId, newComment);
  };

  deleteComment = async (commentId: MongooseObjtId, currentUserId: MongooseObjtId): Promise<void> => {
    if (!ObjectId.isValid(commentId)) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const commentToDelete = await this.commentsRepository.getCommentById(commentId);

    if (!commentToDelete) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    // both .toString() ?
    const isOwner = currentUserId.toString() === commentToDelete.commentatorInfo.userId.toString();

    if (!isOwner) {
      throw ErrorService(HTTP_ERROR_MESSAGES.FORBIDDEN_403, HTTP_STATUS_CODES.FORBIDDEN_403);
    }

    await this.commentsRepository.deleteComment(commentId);
  };
}
