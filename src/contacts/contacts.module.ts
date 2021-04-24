import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  exports: [TypeOrmModule],
})
export class ContactsModule {}
