import { Message } from 'src/messages/messages.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  //   @Column({ nullable: true })
  //   userId: string;
  //   @Column({ nullable: true })
  //   userId: string;

  @ManyToMany((type) => User, (user) => user.chats, { cascade: true })
  @JoinTable({
    name: 'chat_user',
    joinColumn: {
      name: 'chat',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  users!: User[];

  @OneToMany((type) => Message, (message) => message.chat)
  messages!: Message[];

  //   @ManyToOne((type) => User, user => user.)
}
