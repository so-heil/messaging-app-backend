import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UidSession } from './interfaces/uidSession';
@Injectable()
export class IdentityCheck implements NestMiddleware {
  use(req: Request & UidSession, res: Response, next: NextFunction): void {
    const uid = req.session.uid;
    uid ? next() : res.status(401).send('Forbidden');
  }
}
