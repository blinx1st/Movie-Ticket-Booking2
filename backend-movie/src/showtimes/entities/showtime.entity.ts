import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column({ nullable: true })
  cinema?: string;

  @Column({ nullable: true })
  city?: string;

  @Column('json')
  times: string[];

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true })
  room?: string;
}
