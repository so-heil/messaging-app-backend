import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Chat } from './chats.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async getChatMessages(chatId: number): Promise<Chat | undefined> {
    return this.chatsRepository.findOne(chatId, { relations: ['messages'] });
  }
}
