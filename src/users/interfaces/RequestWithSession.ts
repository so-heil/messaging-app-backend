import { Request } from 'express';
import { UidSession } from './uidSession';
export type ReqWithSess<T> = Request<T> & UidSession;
