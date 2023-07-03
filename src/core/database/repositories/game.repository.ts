import { Repository, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import GameEntity from '../entities/game.entity';

export interface IGameRepository extends Repository<GameEntity> {
  getById(id: string, withGuesses?: boolean): Promise<GameEntity | null>;
}

@Injectable()
export default class GameRepository
  extends Repository<GameEntity>
  implements IGameRepository
{
  constructor(public readonly manager: EntityManager) {
    super(GameEntity, manager);
  }

  getById(id: string, withGuesses?: boolean): Promise<GameEntity> {
    return this.findOne({
      where: { id: id! },
      relations: withGuesses ? ['guesses'] : [],
    });
  }

  findByUserId(userId: string): Promise<GameEntity[]> {
    return this.findBy({ userId: userId! });
  }
}
