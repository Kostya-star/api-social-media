import { ISessionDB, ISessionView } from '@/types/sessions/session';

export function deviceObjMapper(session: ISessionDB): ISessionView {
  return {
    ip: session.ipAddress,
    title: session.userAgent,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId,
  };
}
