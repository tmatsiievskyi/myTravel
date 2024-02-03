import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public user_id: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ unique: true })
  public email: string;

  @Column({ unique: true })
  public password?: string;

  @Column({ nullable: true })
  public avatar?: string;

  @Column({ nullable: true })
  public country?: string;

  @Column({ nullable: true })
  public timeZone?: string;

  @Column({ nullable: true })
  public language?: string;

  @Column({ nullable: true })
  public ip?: string;

  @Column({ default: false })
  public archived?: boolean;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'role_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'role_id',
    },
  })
  public roles?: Role[];

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;
}
