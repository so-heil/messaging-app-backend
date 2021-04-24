import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chat } from 'src/chats/chats.entity';
import { Contact } from 'src/contacts/contacts.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { SendMessageDto } from './interfaces/sendMessageDto';
@WebSocketGateway()
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  roomId!: string;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async handleConnection(socket: Socket) {
    const uid = socket.handshake.auth.uid as string;
    const user = await this.usersRepository.findOne(
      { uid },
      { relations: ['chats'] },
    );
    if (user) {
      socket.join(user.chats.map((chat) => `${chat.id}`));
      socket.data = user;
    } else {
      throw new WsException('Invalid credentials.');
    }
  }

  // @SubscribeMessage('SEND_MESSAGE')
  // async joinRoom(
  //   @MessageBody() data: SendMessageDto,
  //   @ConnectedSocket()
  //   socket: Socket,
  // ) {
  //   const user = socket.data as User;
  //   const sendMessage = () => socket.to(data.chatId).emit('GET_MESSAGE', data);
  //   if (user.chats.find((chat) => `${chat.id}` === data.chatId)) {
  //     sendMessage();
  //     return;
  //   } else {
  //     const chat = await this.chatsRepository.findOne(
  //       { id: Number(data.chatId) },
  //       { relations: ['users'] },
  //     );
  //     if (chat?.users.find((DBUser) => DBUser.id === user.id)) {
  //       sendMessage();
  //       return;
  //     } else {
  //       throw new WsException('NO ACCESS TO THIS ROOM');
  //     }
  //   }
  // }

  async handleDisconnect(socket: Socket) {}
}
