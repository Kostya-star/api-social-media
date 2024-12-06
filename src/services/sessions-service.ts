import SessionsRepository from '@/repositories/sessions/sessions-repository-commands';
import { ErrorService } from './error-service';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';
import { ICreateSessionPayload } from '@/types/sessions/create-session-payload';
import { MongooseObjtId } from '@/types/mongoose-object-id';

const createSession = async (session: ICreateSessionPayload): Promise<MongooseObjtId> => {
  return await SessionsRepository.createSession(session);
};

const updateSession = async (sessionId: string, updates: Partial<ICreateSessionPayload>) => {
  await SessionsRepository.updateSession(sessionId, updates);
};

const deleteSessionsExceptCurrent = async (userId: MongooseObjtId, sessionId: string) => {
  await SessionsRepository.deleteSessionsExceptCurrent(userId, sessionId);
};

const deleteSessionById = async (currUserId: MongooseObjtId, deviceId: string) => {
  const session = await SessionsRepository.findSessionById(deviceId);

  if (!session) {
    throw ErrorService(HTTP_ERROR_MESSAGES.NOT_FOUND_404, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const isOwner = session.userId.toString() === currUserId.toString();

  if (!isOwner) {
    throw ErrorService(HTTP_ERROR_MESSAGES.FORBIDDEN_403, HTTP_STATUS_CODES.FORBIDDEN_403);
  }

  await SessionsRepository.deleteSessionById(deviceId);
};

export default {
  createSession,
  updateSession,
  deleteSessionsExceptCurrent,
  deleteSessionById,
};
