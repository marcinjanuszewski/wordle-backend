import { Repository, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import GameGuessEntity from '../entities/game-guess.entity';

export interface IGameGuessRepository extends Repository<GameGuessEntity> {
  getById(id: string): Promise<GameGuessEntity | null>;
}

@Injectable()
export default class GameGuessRepository
  extends Repository<GameGuessEntity>
  implements IGameGuessRepository
{
  constructor(public readonly manager: EntityManager) {
    super(GameGuessEntity, manager);
  }

  getById(id: string): Promise<GameGuessEntity> {
    return this.findOneBy({ id: id! });
  }

  findByGameId(gameId: string): Promise<GameGuessEntity[]> {
    return this.findBy({ gameId: gameId! });
  }
}
