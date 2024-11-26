import { ObjectId } from 'mongodb';
import { usersCollection } from '../../src/DB/index';
import { IUser } from '../../src/types/users/user';
import { resendRegistrationEmail, selfRegisterUserBody } from './helpers';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { HTTP_STATUS_CODES } from '../../src/const/http-status-codes';
import { AuthErrorsList } from '../../src/errors/auth-errors';

const userData: IUser = {
  ...selfRegisterUserBody,
  createdAt: new Date(),
  hashedPassword: '12345',
  emailConfirmation: {
    code: uuidv4(),
    expDate: add(new Date(), {
      minutes: 5,
    }),
    isConfirmed: false,
  },
};

describe('POST resend code to user on registration /auth/registration-email-resending', () => {
  let testUserId: ObjectId;

  beforeEach(async () => {
    const res = await usersCollection.insertOne(userData);
    testUserId = res.insertedId;
  });

  afterEach(async () => {
    await usersCollection.deleteMany({});
  });

  it('should resend the confirmation code if the email is valid and not confirmed', async () => {
    const response = await resendRegistrationEmail(userData.email);
    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(testUserId) });

    // @ts-ignore
    expect(updatedUser.emailConfirmation.code).not.toBe(userData.emailConfirmation!.code);

    // @ts-ignore
    expect(new Date(updatedUser.emailConfirmation.expDate).getTime())
      // @ts-ignore
      .toBeGreaterThan(new Date(userData.emailConfirmation!.expDate as Date).getTime());

    // @ts-ignore
    expect(updatedUser.emailConfirmation.isConfirmed).toBe(false);
  });

  it('should return 400 if the user does not exist', async () => {
    const response = await resendRegistrationEmail('nonexistent@example.com');

    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(response.body.errorsMessages[0].field).toBe('email');
    expect(response.body.errorsMessages[0].message).toBe(AuthErrorsList.EMAIL_WRONG);
  });

  it('should return 400 if the email is already confirmed', async () => {
    // Manually confirm the user
    await usersCollection.updateOne({ _id: new ObjectId(testUserId) }, { $set: { 'emailConfirmation.isConfirmed': true } });

    const response = await resendRegistrationEmail(userData.email);
    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(response.body.errorsMessages[0].field).toBe('email');
    expect(response.body.errorsMessages[0].message).toBe(AuthErrorsList.CONFIRM_CODE_BEEN_APPLIED);
  });
});
