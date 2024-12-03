import { IEmailConfirmationBody } from './email-confirmation-body';
import { Types } from 'mongoose';

export interface IUserDB {
  _id: Types.ObjectId;
  login: string;
  email: string;
  hashedPassword: string;
  emailConfirmation: IEmailConfirmationBody;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserView extends Omit<IUserDB, '_id' | 'hashedPassword' | 'emailConfirmation' | 'updatedAt'> {
  id: Types.ObjectId;
}
