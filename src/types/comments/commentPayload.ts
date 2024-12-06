import { ICommentView } from './comment';

export interface ICommentPayload extends Omit<ICommentView, 'id' | 'createdAt' | 'likesInfo'> {
  content: string;
}