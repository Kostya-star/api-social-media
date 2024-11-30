import { sessionsCollection } from '@/DB';
import { ISession } from '@/types/sessions/session';
import { WithId } from 'mongodb';

const findSessionById = async (sessionId: string): Promise<WithId<ISession> | null> => {
  return await sessionsCollection.findOne({ sessionId });
};

const createSession = async (session: ISession) => {
  await sessionsCollection.insertOne(session);
};

const updateSession = async (sessionId: string, updates: Partial<ISession>) => {
  await sessionsCollection.updateOne({ sessionId }, { $set: updates });
};

const deleteSession = async (sessionId: string) => {
  await sessionsCollection.deleteOne({ sessionId });
};

export default {
  findSessionById,
  createSession,
  updateSession,
  deleteSession,
};
