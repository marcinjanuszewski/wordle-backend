import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import BaseEntity from './base.entity';
import UserEntity from './user.entity';
import GameGuessEntity from './game-guess.entity';

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

  @OneToMany(() => GameGuessEntity, (m) => m.game)
  public guesses?: GameGuessEntity;
}
