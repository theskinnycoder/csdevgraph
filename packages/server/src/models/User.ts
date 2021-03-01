import { hash, verify } from 'argon2';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'user' })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  handle!: string;

  @Column('text')
  email!: string;

  @Column('varchar', { select: false })
  password!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }

  async matchPasswords(password: string) {
    return await verify(this.password, password);
  }
}
