import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  columnId: string;

  @Column()
  avatar: string;

  @Column()
  nickname: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  desc: string;

  @Column()
  createAt: string;

  @Column()
  updateAt: string;
}
