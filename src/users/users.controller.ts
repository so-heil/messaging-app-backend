import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Session,
} from '@nestjs/common';
import { Chat } from 'src/chats/chats.entity';
import { createChatDto } from './interfaces/createChat.dto';
import { CreateUserDto } from './interfaces/createUser.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UidSession } from './interfaces/uidSession';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  async create(
    @Req() request: Request<unknown, unknown, CreateUserDto> & UidSession,
  ): Promise<User | string> {
    return await this.usersService.authenticate(request);
  }

  @Get()
  async findAllChats(
    @Session() session: UidSession['session'],
  ): Promise<undefined | User> {
    const uid = session.uid;
    const user = await this.usersService.getUserChats(uid);
    return user;
  }

  @Post('/chat')
  async createChat(
    @Body() createChatDto: createChatDto,
    @Session() session: UidSession['session'],
  ): Promise<Chat | undefined> {
    try {
      return await this.usersService.createChat(
        session.uid,
        createChatDto.phoneNumber,
      );
    } catch (error) {
      throw new HttpException(
        error.message ?? 'Cannot create group',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/contacts')
  async createContact(
    @Body() dto: createContactDto,
    @Session() session: UidSession['session'],
  ) {
    try {
      return await this.usersService.createContact(
        session.uid,
        dto.phone,
        dto.name,
      );
    } catch (error) {
      throw new HttpException(
        error.message ?? 'BAD_REQUEST',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/contacts')
  async getContacts(@Session() session: UidSession['session']) {
    try {
      return await this.usersService.getContacts(session.uid);
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
  }
  // @Get()
  // async get() {
  //   return await this.usersService.getChats();
  // }
}
