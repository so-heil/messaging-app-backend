import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chats/chats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {}
