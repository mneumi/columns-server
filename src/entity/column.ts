import {
  Entity,
  Column as TypeOrmColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Column {
  @PrimaryGeneratedColumn()
  id: number;

  @TypeOrmColumn({ unique: true })
  columnId: string;

  @TypeOrmColumn()
  picture: string;

  @TypeOrmColumn({ nullable: false })
  title: string;

  @TypeOrmColumn({ nullable: false })
  desc: string;

  @TypeOrmColumn()
  createAt: string;

  @TypeOrmColumn()
  updateAt: string;
}
