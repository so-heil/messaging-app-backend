import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Chat } from 'src/chats/chats.entity';
import { Contact } from 'src/contacts/contacts.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { nullable: true })
  display_name!: string;

  @Column('varchar')
  uid!: string;
  @Column('text')
  phone!: string;

  // @Column({ nullable: true })
  // chatId: number;
  // @Column({ nullable: true })
  // chatId: number;

  @ManyToMany((type) => Chat, (chat) => chat.users)
  chats!: Chat[];

  @OneToMany(() => Contact, (contact) => contact.owner)
  contacts!: Contact[];

  @OneToMany(() => Contact, (contact) => contact.relatesTo)
  relatedContacts!: Contact[];
}
