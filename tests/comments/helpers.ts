import { req } from '../helper';
import { ICommentBody } from '../../src/types/comments/commentBody';
import { ObjectId } from 'mongodb';
import { APP_ROUTES } from '../../src/routing';
import { IBaseQuery } from '../../src/types/base-query';
import { IComment } from '../../src/types/comments/comment';

export const getCommentsForPost = async (postId: ObjectId, query: IBaseQuery<IComment> = {}) => {
  return await req.get(`${APP_ROUTES.POSTS}/${postId}${APP_ROUTES.COMMENTS}`).query(query);
};

export const getCommentById = async (commentId: ObjectId) => {
  return await req.get(`${APP_ROUTES.COMMENTS}/${commentId}`);
};

export const createCommentForPost = async (postId: ObjectId, commentBody: ICommentBody, token: string) => {
  const request = req.post(`${APP_ROUTES.POSTS}/${postId}${APP_ROUTES.COMMENTS}`).send(commentBody);

  if (token) {
    request.set('Authorization', `Bearer ${token}`);
  }

  return await request;
};

export const updateComment = async (commentId: ObjectId, updatedContent: ICommentBody, token: string) => {
  const request = req.put(`${APP_ROUTES.COMMENTS}/${commentId}`).send(updatedContent);

  if (token) {
    request.set('Authorization', `Bearer ${token}`);
  }

  return await request;
};

// export const deleteCommentById = async (commentId: string) => {
//   return req.delete(`${APP_ROUTES.COMMENTS}/${commentId}`);
// };
