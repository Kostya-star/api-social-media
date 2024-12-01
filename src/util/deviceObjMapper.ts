import { ISession, ISessionReturn } from '@/types/sessions/session';
import { WithId } from 'mongodb';

export function deviceObjMapper(session: WithId<ISession>): ISessionReturn {
  return {
    ip: session.ipAddress,
    title: session.userAgent,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId,
  };
}
