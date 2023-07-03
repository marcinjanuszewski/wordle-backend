import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import BaseEntity from './base.entity';
import GameEntity from './game.entity';

@Entity({ name: 'game_guess' })
export default class GameGuessEntity extends BaseEntity {
  @Column()
  public guess: string;

  @Column({ name: 'gameId', nullable: false })
  public gameId: string;

  @ManyToOne(() => GameEntity, (m) => m.guesses)
  @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
  public game?: GameEntity;
}
