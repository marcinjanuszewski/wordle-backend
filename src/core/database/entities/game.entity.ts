import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import BaseEntity from './base.entity';
import UserEntity from './user.entity';

import { GameStatus } from '../../../app/game/types/game-status.enum';

@Entity({ name: 'game' })
export default class GameEntity extends BaseEntity {
  @Column({ nullable: false })
  public word: string;

  @Column({ name: 'status', default: GameStatus.STARTED })
  public status: GameStatus;

  @Column({ name: 'userId', nullable: false })
  public userId: string;

  @ManyToOne(() => UserEntity, (m) => m.games)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user?: UserEntity;
}
