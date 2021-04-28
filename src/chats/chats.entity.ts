import { Message } from 'src/messages/messages.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  display_name!: string;

  @Column({ nullable: true })
  photo_url!: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages!: Message[];
}
