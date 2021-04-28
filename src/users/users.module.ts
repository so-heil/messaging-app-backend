import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { IdentityCheck } from './users.middleware';
import { Chat } from 'src/chats/chats.entity';
import { Contact } from 'src/contacts/contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Contact])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IdentityCheck)
      .forRoutes('/users/check', 'users/chat', 'users/contacts');
  }
}
