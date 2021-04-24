import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { IdentityCheck } from './users.middleware';
import { ChatsModule } from 'src/chats/chats.module';
import { Session } from 'src/session/session.entity';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ChatsModule, ContactsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdentityCheck).forRoutes('/u/y');
  }
}
