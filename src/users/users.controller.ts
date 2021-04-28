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
import { UidSession } from './interfaces/uidSession';
import { UpdateProfileDto } from './interfaces/updateProfile.dto';
import { ReqWithSess } from './interfaces/RequestWithSession';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async create(
    @Req() request: ReqWithSess<CreateUserDto>,
  ): Promise<User | string> {
    try {
      return await this.usersService.register(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/login')
  async getUser(@Req() request: ReqWithSess<loginDto>): Promise<User> {
    try {
      return await this.usersService.login(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/update')
  async updateUser(@Req() req: ReqWithSess<UpdateProfileDto>): Promise<User> {
    try {
      return await this.usersService.updateProfile(req.session.uid, req.body);
    } catch (error) {
      throw new HttpException('No User', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/check')
  async checkIdentity(@Session() session: UidSession['session']) {
    try {
      const user = await this.usersService.getUserBySession(session.uid);
      return user;
    } catch (error) {
      throw new HttpException('You are not logged in', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('/chat/messages/:id')
  async findAll(
    @Param('id') id: string,
    @Session() session: UidSession['session'],
  ) {
    try {
      return await this.usersService.getChatMessages(id, session.uid);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/chat')
  async findAllChats(): Promise<Chat[]> {
    try {
      return await this.usersService.getChats();
    } catch (error) {
      console.log(error);
      throw new HttpException('s', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/chat')
  async createChat(
    @Body() createChatDto: createChatDto,
  ): Promise<Chat | undefined> {
    try {
      return await this.usersService.createChat(createChatDto);
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
}
