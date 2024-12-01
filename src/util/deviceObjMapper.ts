import { ISession, ISessionReturn } from '@/types/sessions/session';
import { WithId } from 'mongodb';

export function deviceObjMapper(session: WithId<ISession>): ISessionReturn {
  return {
    ip: session.ipAddress,
    title: session.userAgent,
    lastActiveDate: String(session.lastActiveDate),
    deviceId: session.sessionId,
  };
}
