import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  postId: string;

  @Column()
  columnId: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column()
  picture: string;

  @Column()
  createAt: string;

  @Column()
  updateAt: string;
}