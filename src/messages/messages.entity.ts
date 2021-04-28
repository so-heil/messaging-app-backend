import { Chat } from 'src/chats/chats.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column('text')
  content!: string;

  @Column('timestamptz', { nullable: true })
  sentAt!: Date;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat!: Chat;

  @ManyToOne(() => User, (user) => user.messages)
  user!: User;
}
