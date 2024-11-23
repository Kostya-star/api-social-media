import { req } from '../helper';
import { ICommentBody } from '../../src/types/comments/commentBody';
import { ObjectId } from 'mongodb';
import { APP_ROUTES } from '../../src/routing';
import { IBaseQuery } from '../../src/types/base-query';
import { IComment } from '../../src/types/comments/comment';

export const getCommentsForPost = async (postId: ObjectId, query: IBaseQuery<IComment> = {}) => {
  return req.get(`${APP_ROUTES.POSTS}/${postId}${APP_ROUTES.COMMENTS}`).query(query);
};

export const createCommentForPost = async (postId: ObjectId, commentBody: ICommentBody, token: string) => {
  const request = req.post(`${APP_ROUTES.POSTS}/${postId}${APP_ROUTES.COMMENTS}`).send(commentBody);

  if (token) {
    request.set('Authorization', `Bearer ${token}`);
  }

  return await request;
};
