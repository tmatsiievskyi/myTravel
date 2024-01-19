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
  public user_id: number;

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
  })
  public roles?: Role[];

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;
}
