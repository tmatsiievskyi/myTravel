import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  @PrimaryGeneratedColumn('uuid')
  public user_id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ unique: true })
  public password: string;

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

  @Column({ nullable: true })
  public age?: number;

  @Column({ default: false })
  public archived?: boolean;
}
