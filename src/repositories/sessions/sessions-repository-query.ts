import { SessionModel } from '@/DB/models/devices-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { ISessionView } from '@/types/sessions/session';
import { deviceObjMapper } from '@/util/mappers/deviceObjMapper';

const findUserSessions = async (userId: MongooseObjtId): Promise<ISessionView[]> => {
  const sessions = await SessionModel.find({ userId });
  return sessions.map(deviceObjMapper);
};

export default {
  findUserSessions,
};
