import { IUserDB } from '@/types/users/user';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUserDB>(
  {
    login: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    emailConfirmation: {
      code: { type: String, default: null },
      expDate: { type: Date, default: null },
      isConfirmed: { type: Boolean, default: true },
    },
    passwordConfirmation: {
      code: { type: String, default: null },
      expDate: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUserDB>('User', userSchema);
