import { SessionModel } from '@/DB/models/devices-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { ISessionView } from '@/types/sessions/session';
import { deviceObjMapper } from '@/util/mappers/deviceObjMapper';

export class SessionsRepositoryQuery {
  async findUserSessions(userId: MongooseObjtId): Promise<ISessionView[]> {
    const sessions = await SessionModel.find({ userId });
    return sessions.map(deviceObjMapper);
  }
}
