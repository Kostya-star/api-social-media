import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import UsersRepository from '@/repositories/users-repository';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { ObjectId } from 'mongodb';
import { CommentsErrorsList } from '@/errors/comments-errors';
import CommentsRepository from '@/repositories/comments-repository';
import PostsRepository from '@/repositories/posts-repository';
import { PostsErrorsList } from '@/errors/posts-errors';
import { ICommentPayload } from '@/types/comments/commentPayload';
import { ICommentDB } from '@/types/comments/comment';
import { Types } from 'mongoose';

type MObjectId = Types.ObjectId;

const createCommentForPost = async (postId: MObjectId, newComment: { content: string }, userId: MObjectId): Promise<ICommentDB> => {
  if (!ObjectId.isValid(postId)) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const post = await PostsRepository.getPostById(postId);

  if (!post) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const userInfo = await UsersRepository.findUserByFilter({ _id: userId });

  const postComment: ICommentPayload & { postId: MObjectId } = {
    content: newComment.content,
    postId,
    commentatorInfo: {
      userId,
      userLogin: userInfo!.login,
    },
  };

  return await CommentsRepository.createComment(postComment);
};

const updateComment = async (commentId: MObjectId, newComment: { content: string }, currentUserId: MObjectId): Promise<void> => {
  if (!ObjectId.isValid(commentId)) {
    throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const commentToUpdate = await CommentsRepository.getCommentById(commentId);

  if (!commentToUpdate) {
    throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  // both .toString() ?
  const isOwner = currentUserId.toString() === commentToUpdate.commentatorInfo.userId.toString();

  if (!isOwner) {
    throw ErrorService(HTTP_ERROR_MESSAGES.FORBIDDEN_403, HTTP_STATUS_CODES.FORBIDDEN_403);
  }

  await CommentsRepository.updateComment(commentId, newComment);
};

const deleteComment = async (commentId: MObjectId, currentUserId: MObjectId): Promise<void> => {
  if (!ObjectId.isValid(commentId)) {
    throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const commentToDelete = await CommentsRepository.getCommentById(commentId);

  if (!commentToDelete) {
    throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  // both .toString() ?
  const isOwner = currentUserId.toString() === commentToDelete.commentatorInfo.userId.toString();

  if (!isOwner) {
    throw ErrorService(HTTP_ERROR_MESSAGES.FORBIDDEN_403, HTTP_STATUS_CODES.FORBIDDEN_403);
  }

  await CommentsRepository.deleteComment(commentId);
};

export default {
  createCommentForPost,
  updateComment,
  deleteComment,
};
