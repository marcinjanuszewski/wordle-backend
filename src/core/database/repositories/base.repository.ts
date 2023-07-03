import { FindOptionsWhere, Repository } from 'typeorm';

import BaseEntity from '../entities/base.entity';

export interface IBaseRepository<TEntity extends BaseEntity>
  extends Repository<TEntity> {
  getById(id: string): Promise<TEntity | null>;
}

export default abstract class BaseRepository<TEntity extends BaseEntity>
  extends Repository<TEntity>
  implements IBaseRepository<TEntity>
{
  getById(id: string): Promise<TEntity | null> {
    const where = {
      id: id!,
    } as FindOptionsWhere<TEntity>; // typing issue caused by typeorm update

    return this.findOneBy(where);
  }
}
