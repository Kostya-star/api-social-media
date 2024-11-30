import SessionsRepository from '@/repositories/sessions-repository';
import { ISession } from '@/types/sessions/session';

const createSession = async (session: ISession) => {
  await SessionsRepository.createSession(session);
};

const updateSession = async (sessionId: string, updates: Partial<ISession>) => {
  await SessionsRepository.updateSession(sessionId, updates);
};

export default {
  createSession,
  updateSession,
};
