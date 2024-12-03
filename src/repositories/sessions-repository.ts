import { SessionModel } from '@/models/devices-model';
import { ICreateSessionPayload } from '@/types/sessions/create-session-payload';
import { ISessionDB } from '@/types/sessions/session';
import { Types } from 'mongoose';

type MObjectId = Types.ObjectId;

const findUserSessions = async (userId: MObjectId): Promise<ISessionDB[]> => {
  return await SessionModel.find({ userId });
};

const findSessionById = async (deviceId: string): Promise<ISessionDB | null> => {
  return await SessionModel.findOne({ deviceId });
};

const createSession = async (session: ICreateSessionPayload): Promise<ISessionDB> => {
  return await SessionModel.create(session);
};

const updateSession = async (deviceId: string, updates: Partial<ICreateSessionPayload>) => {
  await SessionModel.updateOne({ deviceId }, updates);
};

const deleteSessionsExceptCurrent = async (userId: MObjectId, sessionId: string) => {
  await SessionModel.deleteMany({ userId, deviceId: { $ne: sessionId } });
};

const deleteSessionById = async (deviceId: string) => {
  await SessionModel.deleteOne({ deviceId });
};

export default {
  findSessionById,
  findUserSessions,
  createSession,
  updateSession,
  deleteSessionsExceptCurrent,
  deleteSessionById,
};
