import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import BaseRepository, { IBaseRepository } from './base.repository';

import GameGuessEntity from '../entities/game-guess.entity';

export interface IGameGuessRepository extends IBaseRepository<GameGuessEntity> {
  findByGameId(gameId: string): Promise<GameGuessEntity[]>;
}

@Injectable()
export default class GameGuessRepository
  extends BaseRepository<GameGuessEntity>
  implements IGameGuessRepository
{
  constructor(public readonly manager: EntityManager) {
    super(GameGuessEntity, manager);
  }

  findByGameId(gameId: string): Promise<GameGuessEntity[]> {
    return this.findBy({ gameId: gameId! });
  }
}
