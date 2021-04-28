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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  display_name!: string;

  @Column({ nullable: true })
  photo_url!: string;

  @OneToMany((type) => Message, (message) => message.chat)
  messages!: Message[];
}
