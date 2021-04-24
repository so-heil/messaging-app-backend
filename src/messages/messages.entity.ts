import { Chat } from 'src/chats/chats.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column('text')
  text!: string;

  @ManyToOne((type) => Chat, (chat) => chat.messages)
  chat!: Chat;
}
