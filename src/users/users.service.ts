import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chats/chats.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './interfaces/createUser.dto';
import { User } from './user.entity';
import * as admin from 'firebase-admin';
import { Contact } from 'src/contacts/contacts.entity';
import { Message } from 'src/messages/messages.entity';
import { DeepPartial } from 'typeorm';
import { createChatDto } from './interfaces/createChat.dto';
import { UpdateProfileDto } from './interfaces/updateProfile.dto';
import { ReqWithSess } from './interfaces/RequestWithSession';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async register(req: ReqWithSess<CreateUserDto>): Promise<User> {
    const { display_name, photo_url } = req.body;
    const credentials = await admin.auth().verifyIdToken(req.body.token);
    const { uid, phone_number: phone } = credentials;
    const oldUser = await this.usersRepository.findOne({ where: { phone } });
    req.session.uid = uid;
    if (oldUser) {
      return oldUser;
    } else {
      if (display_name) {
        const user = this.usersRepository.create({
          uid,
          phone,
          display_name,
          photo_url,
        });
        return await this.usersRepository.save(user);
      } else {
        throw new Error('No name provided');
      }
    }
  }

  async login(req: ReqWithSess<loginDto>): Promise<User> {
    const credentials = await admin.auth().verifyIdToken(req.body.token);
    const { uid, phone_number: phone } = credentials;
    const oldUser = await this.usersRepository.findOne({ where: { phone } });
    req.session.uid = uid;
    if (oldUser) {
      return oldUser;
    } else {
      throw new Error('User not registered.');
    }
  }

  async updateProfile(uid: string, dto: UpdateProfileDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail({ uid });
      user.display_name = dto.display_name ?? user.display_name;
      user.photo_url = dto.photo_url ?? user.photo_url;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new Error();
    }
  }

  async getUserBySession(uid: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { uid },
      });
      return user;
    } catch (error) {
      throw new Error();
    }
  }

  async createChat(dto: createChatDto): Promise<Chat> {
    try {
      if (
        await this.chatsRepository.findOne({
          where: { display_name: dto.name },
        })
      ) {
        throw new Error('Already exists');
      } else {
        const newChat = this.chatsRepository.create({
          display_name: dto.name,
          photo_url: dto.photo_url,
        });
        return await this.chatsRepository.save(newChat);
      }
    } catch (error) {
      throw new Error('Unable to create chat.');
    }
  }

  async getChats() {
    return this.chatsRepository.find({ relations: ['messages'] });
  }

  async getChatMessages(
    chatId: string,
    uid: string,
  ): Promise<DeepPartial<Message>[]> {
    try {
      const user = await this.usersRepository.findOne({ where: { uid } });

      const chat = await this.chatsRepository.findOne(
        { id: chatId },
        {
          relations: ['messages', 'messages.user'],
        },
      );

      if (chat) {
        return chat.messages.map((message) => ({
          ...message,
          user: {
            display_name: message.user.display_name,
            photo_url: message.user.photo_url,
            // send id as sensitive data only to the user who requested it.
            id: message.user.id === user?.id ? user.id : undefined,
          },
        }));
      } else {
        throw new Error(`Can't find chat.`);
      }
    } catch (error) {
      throw new Error(`Can't find chat.`);
    }
  }

  async createContact(
    uid: string,
    phone: string,
    name: string,
  ): Promise<Contact> {
    const owner = await this.usersRepository.findOne(
      { uid },
      { relations: ['contacts', 'contacts.relatesTo'] },
    );

    const relatesTo = await this.usersRepository.findOne({ phone });
    if (
      owner?.contacts?.find(
        (contact) => contact?.relatesTo?.id === relatesTo?.id,
      )
    ) {
      throw new Error('Already Exists');
    }

    if (owner && relatesTo) {
      const newContact = this.contactsRepository.create({
        name,
        owner,
        relatesTo,
      });
      return await this.contactsRepository.save(newContact);
    }

    throw new Error('No User Found');
  }

  async getContacts(uid: string): Promise<Contact[]> {
    const userWithContacts = await this.usersRepository.findOne(
      { uid },
      { relations: ['contacts', 'contacts.relatesTo'] },
    );

    if (userWithContacts?.contacts) {
      return userWithContacts.contacts;
    }

    throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
  }
}
