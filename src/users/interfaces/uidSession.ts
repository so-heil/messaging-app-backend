import { Session } from 'express-session';
export interface UidSession {
  session: Session & {
    uid: string;
  };
}
