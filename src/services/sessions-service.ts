import { ErrorService } from './error-service';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateSessionPayload } from '@/types/sessions/create-session-payload';
import { MongooseObjtId } from '@/types/mongoose-object-id';
import { SessionsRepositoryCommands } from '@/repositories/sessions/sessions-repository-commands';

export class SessionsService {
  protected sessionsRepository;

  constructor(sessionsRepository: SessionsRepositoryCommands) {
    this.sessionsRepository = sessionsRepository;
  }
  
  createSession = async (session: ICreateSessionPayload): Promise<MongooseObjtId> => {
    return await this.sessionsRepository.createSession(session);
  };

  updateSession = async (sessionId: string, updates: Partial<ICreateSessionPayload>) => {
    await this.sessionsRepository.updateSession(sessionId, updates);
  };

  deleteSessionsExceptCurrent = async (userId: MongooseObjtId, sessionId: string) => {
    await this.sessionsRepository.deleteSessionsExceptCurrent(userId, sessionId);
  };

  deleteSessionById = async (currUserId: MongooseObjtId, deviceId: string) => {
    const session = await this.sessionsRepository.findSessionById(deviceId);

    if (!session) {
      throw ErrorService(HTTP_ERROR_MESSAGES.NOT_FOUND_404, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const isOwner = session.userId.toString() === currUserId.toString();

    if (!isOwner) {
      throw ErrorService(HTTP_ERROR_MESSAGES.FORBIDDEN_403, HTTP_STATUS_CODES.FORBIDDEN_403);
    }

    await this.sessionsRepository.deleteSessionById(deviceId);
  };
}
