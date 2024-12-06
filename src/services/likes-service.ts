import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ObjectId } from 'mongodb';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { LikeStatus } from '@/const/likes/like-status';
import { CommentsErrorsList } from '@/errors/comments-errors';
import CommentsRepository from '@/repositories/comments-repository';
import LikesRepository from '@/repositories/likes-repository';

const handleLike = async (likedEntityId: MongooseObjtId, likeStatus: LikeStatus, currentUserId: MongooseObjtId, entityType: 'isComment'): Promise<void> => {
  if (entityType === 'isComment') {
    if (!ObjectId.isValid(likedEntityId)) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }
  
    const comment = await CommentsRepository.getCommentById(likedEntityId);
  
    if (!comment) {
      throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
    }
  } // else if (entityType === 'isPost')   

  await LikesRepository.updateLike(likedEntityId, likeStatus, currentUserId);
};

export default {
  handleLike,
};
