import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsController } from './chats.controller';
import { Chat } from './chats.entity';
import { ChatsService } from './chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatsService],
  controllers: [ChatsController],
  exports: [TypeOrmModule],
})
export class ChatsModule {}
