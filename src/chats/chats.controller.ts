import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
}
