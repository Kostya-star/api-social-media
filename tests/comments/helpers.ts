import { req } from '../helper';
import { ICommentBody } from '../../src/types/comments/commentBody';
import { ObjectId } from 'mongodb';
import { APP_ROUTES } from '../../src/routing';

export const createCommentForPost = async (postId: ObjectId, commentBody: ICommentBody, token: string) => {
  const request = req.post(`${APP_ROUTES.POSTS}/${postId}${APP_ROUTES.COMMENTS}`).send(commentBody);

  if (token) {
    request.set('Authorization', `Bearer ${token}`);
  }

  return await request;
};
