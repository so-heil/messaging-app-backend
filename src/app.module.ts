import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ChatsService } from './chats/chats.service';
import { ChatsController } from './chats/chats.controller';
import { ChatsModule } from './chats/chats.module';
import { ContactsController } from './contacts/contacts.controller';
import { ContactsModule } from './contacts/contacts.module';
import { MessagesModule } from './messages/messages.module';
import { MessagesGateway } from './messages/messages.geteway';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    ChatsModule,
    MessagesModule,
    ContactsModule,
  ],
  controllers: [
    AppController,
    UsersController,
    ChatsController,
    ContactsController,
  ],
  providers: [AppService, UsersService, ChatsService, MessagesGateway],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
