import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ObjectId } from 'mongodb';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { LikeStatus } from '@/const/likes/like-status';
import { CommentsErrorsList } from '@/errors/comments-errors';
import { LikesRepositoryCommands } from '@/repositories/likes-repository-commands';
import { CommentsRepositoryCommands } from '@/repositories/comments/comments-repository-commands';
import { PostsErrorsList } from '@/errors/posts-errors';
import { PostsRepositoryCommands } from '@/repositories/posts/posts-repository-commands';
import { UsersRepositoryCommands } from '@/repositories/users/users-repository-commands';
import { UsersErrorsList } from '@/errors/users-errors';

export class LikesService {
  protected likesRepository;
  protected commentsRepository;
  protected postsRepository;
  protected usersRepository;

  constructor(
    likesRepository: LikesRepositoryCommands,
    commentsRepository: CommentsRepositoryCommands,
    postsRepository: PostsRepositoryCommands,
    usersRepository: UsersRepositoryCommands
  ) {
    this.likesRepository = likesRepository;
    this.commentsRepository = commentsRepository;
    this.postsRepository = postsRepository;
    this.usersRepository = usersRepository;
  }

  async handleLike(likedEntityId: MongooseObjtId, likeStatus: LikeStatus, currentUserId: MongooseObjtId, entityType: 'isComment' | 'isPost'): Promise<void> {
    const user = await this.usersRepository.getUserById(currentUserId);

    if (!user) {
      throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    if (entityType === 'isComment') {
      if (!ObjectId.isValid(likedEntityId)) {
        throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const comment = await this.commentsRepository.getCommentById(likedEntityId);

      if (!comment) {
        throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }
    } else if (entityType === 'isPost') {
      if (!ObjectId.isValid(likedEntityId)) {
        throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      const post = await this.postsRepository.getPostById(likedEntityId);

      if (!post) {
        throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
      }
    }

    await this.likesRepository.updateLike(likedEntityId, likeStatus, currentUserId, user.login);
  }
}
