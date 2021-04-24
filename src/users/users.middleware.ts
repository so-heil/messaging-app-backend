import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UidSession } from './interfaces/uidSession';

// @Injectable()
// export class UsersMiddleware implements NestMiddleware {
//   async use(
//     req: Request<unknown, unknown, CreateUserDto> & {
//       session: { uid: string };
//     },
//     res: Response,
//     next: NextFunction,
//   ) {
//     try {
//       const credentials = await admin.auth().verifyIdToken(req.body.token);
//       const uid = credentials.uid;
//       req.session.uid = uid;
//       req.body.phone = credentials.phone_number ?? '';
//       next();
//     } catch (error) {
//       res.status(401).send('Forbidden');
//     }
//   }
// }
@Injectable()
export class IdentityCheck implements NestMiddleware {
  use(req: Request & UidSession, res: Response, next: NextFunction): void {
    const uid = req.session.uid;
    uid ? next() : res.status(401).send('Forbidden');
  }
}
