import { Repository, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import GameEntity from '../entities/game.entity';

export interface IGameRepository extends Repository<GameEntity> {
  getById(id: string): Promise<GameEntity | null>;
}

@Injectable()
export default class GameRepository
  extends Repository<GameEntity>
  implements IGameRepository
{
  constructor(public readonly manager: EntityManager) {
    super(GameEntity, manager);
  }

  getById(id: string): Promise<GameEntity> {
    return this.findOneBy({ id: id! });
  }

  findByUserId(userId: string): Promise<GameEntity[]> {
    return this.findBy({ userId: userId! });
  }
}
