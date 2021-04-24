import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { nullable: true })
  name!: string;

  @ManyToOne(() => User, (user) => user.relatedContacts, { cascade: true })
  relatesTo: User = new User();

  @ManyToOne(() => User, (user) => user.contacts, { cascade: true })
  owner: User = new User();
}
