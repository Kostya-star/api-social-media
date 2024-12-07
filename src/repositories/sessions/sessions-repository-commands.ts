import { SessionModel } from '@/DB/models/devices-model';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { ICreateSessionPayload } from '@/types/sessions/create-session-payload';
import { ISessionDB } from '@/types/sessions/session';

export class SessionsRepositoryCommands {
  async findSessionById(deviceId: string): Promise<ISessionDB | null> {
    return await SessionModel.findOne({ deviceId });
  }

  async createSession(session: ICreateSessionPayload): Promise<MongooseObjtId> {
    const item = await SessionModel.create(session);
    return item._id;
  }

  async updateSession(deviceId: string, updates: Partial<ICreateSessionPayload>) {
    await SessionModel.updateOne({ deviceId }, updates);
  }

  async deleteSessionsExceptCurrent(userId: MongooseObjtId, sessionId: string) {
    await SessionModel.deleteMany({ userId, deviceId: { $ne: sessionId } });
  }

  async deleteSessionById(deviceId: string) {
    await SessionModel.deleteOne({ deviceId });
  }
}
