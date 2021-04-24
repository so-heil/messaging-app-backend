import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';
import { Message } from './messages.entity';
import { MessagesGateway } from './messages.geteway';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UsersModule, ChatsModule],
  providers: [MessagesGateway],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
