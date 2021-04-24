import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import { TypeormStore } from 'typeorm-store';
import { Session } from './session/session.entity';
import { getConnection } from 'typeorm';
import { SocketIoAdapter } from './socket-io.adapter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:8000', credentials: true },
  });
  app.use(cookieParser());
  const repository = getConnection().getRepository(Session);
  app.use(
    session({
      name: 'QID',
      store: new TypeormStore({ repository }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: process.env.NODE_ENV === 'production', // cookie only works in https
      },
      saveUninitialized: false,
      secret: process.env.QID_COOKIE_SECRET as string,
      resave: true,
    }),
  );
  app.useWebSocketAdapter(new SocketIoAdapter(app, ['http://localhost:8000']));
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  await app.listen(3000);
}
bootstrap();
