import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { AuthSocketDto } from './interfaces/AuthSocket.dto';
import { SendMessageDto } from './interfaces/sendMessageDto';
import { Message } from './messages.entity';
@WebSocketGateway(3001)
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server!: Server;
  roomId!: string;

  private logger: Logger = new Logger('MessageGateway');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  @SubscribeMessage('AUTH_SOCKET')
  async authSocket(
    @MessageBody() data: AuthSocketDto,
    @ConnectedSocket()
    socket: Socket,
  ) {
    const user = await this.usersRepository.findOne(data.id);
    if (user) {
      socket.data.user = user;
      socket.emit('AUTH_SOCKET_RESULT', { authenticated: true });
    } else {
      socket.emit('AUTH_SOCKET_RESULT', { authenticated: false });
    }
  }

  @SubscribeMessage('SEND_MESSAGE')
  async joinRoom(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket()
    socket: Socket,
  ) {
    const user = socket.data.user as User | undefined;

    if (user) {
      const message = await this.addMessageToDb(data, user);

      this.sendMessageToClients(
        { ...message, chatId: data.chatId },
        socket,
        user,
      );
    } else {
      socket.disconnect();
    }
  }

  private addMessageToDb = (wsMessage: SendMessageDto, user: User) => {
    const newMessage = this.messagesRepository.create({
      chat: { id: wsMessage.chatId },
      user: { id: user.id },
      content: wsMessage.message,
      sentAt: new Date(),
    });

    return this.messagesRepository.save(newMessage);
  };

  private sendMessageToClients = (
    message: Message & { chatId: string },
    socket: Socket,
    user: User,
  ) => {
    socket.broadcast.emit('RECEIVE_MESSAGE', {
      ...message,
      user: {
        display_name: user.display_name,
        photo_url: user.photo_url,
      },
    });

    socket.emit('SEND_MESSAGE_RESULT', {
      ...message,
      user: user,
    });
  };

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }
}
