import { ObjectId } from 'mongodb';
import { IEmailConfirmationBody } from './email-confirmation-body';

export interface IUser {
  id?: ObjectId;
  login: string;
  email: string;
  hashedPassword?: string;
  emailConfirmation?: IEmailConfirmationBody;
  createdAt: Date;
}
