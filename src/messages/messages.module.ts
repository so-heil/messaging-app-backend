import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Message } from './messages.entity';
import { MessagesGateway } from './messages.geteway';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UsersModule],
  providers: [MessagesGateway],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
