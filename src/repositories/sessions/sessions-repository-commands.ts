import { SessionModel } from '@/models/devices-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { ICreateSessionPayload } from '@/types/sessions/create-session-payload';
import { ISessionDB } from '@/types/sessions/session';

const findSessionById = async (deviceId: string): Promise<ISessionDB | null> => {
  return await SessionModel.findOne({ deviceId });
};

const createSession = async (session: ICreateSessionPayload): Promise<MongooseObjtId> => {
  const item = await SessionModel.create(session);
  return item._id
};

const updateSession = async (deviceId: string, updates: Partial<ICreateSessionPayload>) => {
  await SessionModel.updateOne({ deviceId }, updates);
};

const deleteSessionsExceptCurrent = async (userId: MongooseObjtId, sessionId: string) => {
  await SessionModel.deleteMany({ userId, deviceId: { $ne: sessionId } });
};

const deleteSessionById = async (deviceId: string) => {
  await SessionModel.deleteOne({ deviceId });
};

export default {
  findSessionById,
  createSession,
  updateSession,
  deleteSessionsExceptCurrent,
  deleteSessionById,
};
