import { SessionData, Session } from 'express-session';

export interface CreateUserDto {
  token: string;
  phone: string;
  uid?: string;
}
