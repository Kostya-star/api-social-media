import { ObjectId } from 'mongodb';
import { usersCollection } from '../../src/DB/index'
import { IUser } from '../../src/types/users/user';
import { confirmRegistration, selfRegisterUserBody } from './helpers';
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

describe('POST /auth/registration-confirmation', () => {
  let testUserId: ObjectId;

  beforeEach(async () => {
    const res = await usersCollection.insertOne(userData);
    testUserId = res.insertedId;
  });

  // Cleanup after each test
  afterEach(async () => {
    await usersCollection.deleteMany({});
  });

  it('should confirm the registration when the code is correct', async () => {
    const response = await confirmRegistration(userData.emailConfirmation!.code as string)
    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT_204);

    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(testUserId) });
    // @ts-ignore
    expect(updatedUser.emailConfirmation.isConfirmed).toBe(true);
  });

  it('should return 400 if the code is incorrect', async () => {
    const response = await confirmRegistration('invalid-code')

    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(response.body.errorsMessages[0].field).toBe('code');
    expect(response.body.errorsMessages[0].message).toBe(AuthErrorsList.CONFIRM_CODE_INCORRECT);
  });

  it('should return 400 if the code is already confirmed', async () => {
    // Manually confirm the user
    await usersCollection.updateOne(
      { _id: new ObjectId(testUserId) },
      { $set: { 'emailConfirmation.isConfirmed': true } }
    );

    const resp = await confirmRegistration(userData.emailConfirmation!.code as string);
    expect(resp.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(resp.status).toBe(400);
    expect(resp.body.errorsMessages[0].field).toBe('code');
    expect(resp.body.errorsMessages[0].message).toBe(AuthErrorsList.CONFIRM_CODE_BEEN_APPLIED);
  });

  it('should return 400 if the code is expired', async () => {
    // Manually expire the code
    await usersCollection.updateOne(
      { _id: new ObjectId(testUserId) },
      { $set: { 'emailConfirmation.expDate': new Date(Date.now() - 10 * 60 * 1000) } } // 10 minutes ago
    );

    const resp = await confirmRegistration(userData.emailConfirmation!.code as string);
    expect(resp.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(resp.body.errorsMessages[0].field).toBe('code');
    expect(resp.body.errorsMessages[0].message).toBe(AuthErrorsList.CONFIRM_CODE_EXPIRED);
  });
});
