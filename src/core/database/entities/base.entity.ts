import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export default abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updatedAt!: Date;
}
