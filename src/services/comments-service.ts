import { ErrorService } from './error-service';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { IAuthLoginPayload } from '@/types/auth/auth-login-payload';
import UsersRepository from '@/repositories/users-repository';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId, WithId } from 'mongodb';
import { ICommentBody } from '@/types/comments/commentBody';
import { CommentsErrorsList } from '@/errors/comments-errors';
import CommentsRepository from '@/repositories/comments-repository';
import { IComment } from '@/types/comments/comment';
import PostsRepository from '@/repositories/posts-repository';
import { PostsErrorsList } from '@/errors/posts-errors';

const createCommentForPost = async (postId: ObjectId, newComment: ICommentBody, userId: ObjectId): Promise<WithId<IComment>> => {
  if (!ObjectId.isValid(postId)) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const post = await PostsRepository.getPostById(postId);

  if (!post) {
    throw ErrorService(PostsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const userInfo = await UsersRepository.findUserByFilter({ _id: new ObjectId(userId) });

  const postComment: IComment = {
    content: newComment.content,
    postId,
    commentatorInfo: {
      userId,
      userLogin: userInfo!.login,
    },
    createdAt: new Date(),
  };

  return await CommentsRepository.createComment(postComment);
};

const updateComment = async (commentId: ObjectId, newComment: ICommentBody, currentUserId: ObjectId): Promise<void> => {
  if (!ObjectId.isValid(commentId)) {
    throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const commentToUpdate = await CommentsRepository.getCommentById(commentId);

  if (!commentToUpdate) {
    throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const isOwner = currentUserId === commentToUpdate.commentatorInfo.userId;

  if (!isOwner) {
    throw ErrorService(HTTP_ERROR_MESSAGES.FORBIDDEN_403, HTTP_STATUS_CODES.FORBIDDEN_403);
  }

  await CommentsRepository.updateComment(commentId, newComment);
};

const deleteComment = async (commentId: ObjectId, currentUserId: ObjectId): Promise<void> => {
  if (!ObjectId.isValid(commentId)) {
    throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const commentToDelete = await CommentsRepository.getCommentById(commentId);

  if (!commentToDelete) {
    throw ErrorService(CommentsErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const isOwner = currentUserId === commentToDelete.commentatorInfo.userId;

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
