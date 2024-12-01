import { sessionsCollection } from '@/DB';
import { ISession } from '@/types/sessions/session';
import { ObjectId, WithId } from 'mongodb';

const findUserSessions = async (userId: ObjectId): Promise<WithId<ISession>[]> => {
  return await sessionsCollection.find({ userId: new ObjectId(userId) }).toArray();
};

const findSessionById = async (sessionId: string): Promise<WithId<ISession> | null> => {
  return await sessionsCollection.findOne({ sessionId });
};

const createSession = async (session: ISession) => {
  await sessionsCollection.insertOne(session);
};

const updateSession = async (sessionId: string, updates: Partial<ISession>) => {
  await sessionsCollection.updateOne({ sessionId }, { $set: updates });
};

const deleteSessionsExceptCurrent = async (userId: ObjectId, sessionId: string) => {
  await sessionsCollection.deleteMany({ userId: new ObjectId(userId), sessionId: { $ne: sessionId } });
};

const deleteSessionById = async (sessionId: string) => {
  await sessionsCollection.deleteOne({ sessionId });
};

export default {
  findSessionById,
  findUserSessions,
  createSession,
  updateSession,
  deleteSessionsExceptCurrent,
  deleteSessionById,
};
