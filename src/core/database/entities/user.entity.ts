import { Entity, Column, Index } from 'typeorm';

import BaseEntity from './base.entity';

@Entity({ name: 'user' })
@Index('UK_USER_EMAIL', { synchronize: false })
export default class UserEntity extends BaseEntity {
  @Column({ nullable: false })
  public email: string;

  @Column({ nullable: false })
  public passwordHash: string;
}
