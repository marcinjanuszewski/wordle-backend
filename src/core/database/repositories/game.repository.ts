import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import BaseRepository, { IBaseRepository } from './base.repository';

import GameEntity from '../entities/game.entity';

export interface IGameRepository extends IBaseRepository<GameEntity> {
  getById(id: string, withGuesses?: boolean): Promise<GameEntity | null>;
}

@Injectable()
export default class GameRepository
  extends BaseRepository<GameEntity>
  implements IGameRepository
{
  constructor(public readonly manager: EntityManager) {
    super(GameEntity, manager);
  }

  getById(id: string, withGuesses?: boolean): Promise<GameEntity | null> {
    return this.findOne({
      where: { id: id! },
      relations: withGuesses ? ['guesses'] : [],
    });
  }

  findByUserId(userId: string): Promise<GameEntity[]> {
    return this.findBy({ userId: userId! });
  }
}
