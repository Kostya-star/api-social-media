import SessionsRepository from '@/repositories/sessions-repository';
import { ISession } from '@/types/sessions/session';
import { ObjectId } from 'mongodb';
import { ErrorService } from './error-service';
import { HTTP_ERROR_MESSAGES } from '@/const/http-error-messages';
import { HTTP_STATUS_CODES } from '@/const/http-status-codes';

const createSession = async (session: ISession) => {
  await SessionsRepository.createSession(session);
};

const updateSession = async (sessionId: string, updates: Partial<ISession>) => {
  await SessionsRepository.updateSession(sessionId, updates);
};

const deleteSessionsExceptCurrent = async (userId: ObjectId, sessionId: string) => {
  await SessionsRepository.deleteSessionsExceptCurrent(userId, sessionId);
};

const deleteSessionById = async (currUserId: ObjectId, deviceId: string) => {
  const session = await SessionsRepository.findSessionById(deviceId);

  if (!session) {
    throw ErrorService(HTTP_ERROR_MESSAGES.NOT_FOUND_404, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const isOwner = session.userId === currUserId

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
