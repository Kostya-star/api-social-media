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
import { inject, injectable } from 'inversify';
import { TYPES } from '@/composition-root-types';

@injectable()
export class LikesService {
  protected likesRepository;
  protected commentsRepository;
  protected postsRepository;
  protected usersRepository;

  constructor(
    @inject(TYPES.likesRepositoryCommands) likesRepository: LikesRepositoryCommands,
    @inject(TYPES.commentsRepositoryCommands) commentsRepository: CommentsRepositoryCommands,
    @inject(TYPES.postsRepositoryCommands) postsRepository: PostsRepositoryCommands,
    @inject(TYPES.usersRepositoryCommands) usersRepository: UsersRepositoryCommands
  ) {
    this.likesRepository = likesRepository;
    this.commentsRepository = commentsRepository;
    this.postsRepository = postsRepository;
    this.usersRepository = usersRepository;
  }

  // ideally its best to have two separate services for likes-post & likes-comments
  async handleLike(likedEntityId: MongooseObjtId, likeStatus: LikeStatus, currentUserId: MongooseObjtId, entityType: 'isComment' | 'isPost'): Promise<void> {
    const user = await this.usersRepository.getUserById(currentUserId);

    if (!user) {
      throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const errorMessage = entityType === 'isComment' ? CommentsErrorsList.NOT_FOUND : PostsErrorsList.NOT_FOUND;

    if (!ObjectId.isValid(likedEntityId)) {
      throw ErrorService(errorMessage, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    let item = null;

    if (entityType === 'isComment') item = await this.commentsRepository.getCommentById(likedEntityId);
    if (entityType === 'isPost') item = await this.postsRepository.getPostById(likedEntityId);

    if (!item) {
      throw ErrorService(errorMessage, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    await this.likesRepository.updateLike(likedEntityId, likeStatus, currentUserId, user.login);
  }
}
