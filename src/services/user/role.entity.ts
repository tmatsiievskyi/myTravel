import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
} from 'typeorm';

import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  public role_id: string;

  @Column()
  public description: string;

  @Column({ default: false })
  public archived: boolean;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'permission_id',
    },
  })
  public permissions?: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  public users: User[];

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;
}
