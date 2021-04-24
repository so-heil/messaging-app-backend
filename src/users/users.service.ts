import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chats/chats.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './interfaces/createUser.dto';
import { User } from './user.entity';
import * as admin from 'firebase-admin';
import { Request } from 'express';
import { UidSession } from './interfaces/uidSession';
import { Contact } from 'src/contacts/contacts.entity';
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

  async authenticate(
    req: Request<unknown, unknown, CreateUserDto> & UidSession,
  ): Promise<User> {
    const credentials = await admin.auth().verifyIdToken(req.body.token);
    const { uid, phone_number: phone } = credentials;
    console.log(uid);
    req.session.uid = uid;
    const user = this.usersRepository.create({ uid, phone });
    return await this.usersRepository.save(user);
  }

  async getUser(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOne(id);
  }

  async getUserChats(uid: string): Promise<User | undefined> {
    return await this.usersRepository.findOne(
      { uid },
      { relations: ['chats'] },
    );
  }

  async createChat(uid: string, phoneNumber: string): Promise<Chat> {
    try {
      const creator = await this.usersRepository.findOne({
        where: { uid },
        relations: ['chats', 'chats.users'],
      });
      const user = await this.usersRepository.findOneOrFail({
        where: { phone: phoneNumber },
      });
      const chat = creator?.chats?.find((chat) =>
        chat.users?.some((user) => user.id === user.id),
      );
      if (chat) {
        return chat;
      }
      if (!!creator && !!user && creator.id !== user.id) {
        const newChat = this.chatsRepository.create({
          users: [
            {
              id: creator.id,
              display_name: creator.display_name,
              phone: creator.phone,
              uid: creator.uid,
            },
            user,
          ],
        });
        return await this.chatsRepository.save(newChat);
      } else {
        throw new Error('Forbidden');
      }
    } catch (error) {
      throw new Error('User not found.');
    }
  }

  async getChats() {
    return this.usersRepository.find({ relations: ['chats'] });
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
