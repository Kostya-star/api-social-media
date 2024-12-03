import { ISessionDB } from './session';

export interface ICreateSessionPayload extends Omit<ISessionDB, '_id' | 'createdAt' | 'updatedAt'> {}
