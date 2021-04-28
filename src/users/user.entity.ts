import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Contact } from 'src/contacts/contacts.entity';
import { Message } from 'src/messages/messages.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('text')
  display_name!: string;

  @Column('varchar')
  uid!: string;

  @Column('text')
  phone!: string;

  @Column('text', { nullable: true })
  photo_url!: string;

  @OneToMany(() => Contact, (contact) => contact.owner)
  contacts!: Contact[];

  @OneToMany(() => Contact, (contact) => contact.relatesTo)
  relatedContacts!: Contact[];

  @OneToMany(() => Message, (message) => message.user)
  messages!: Message[];
}
