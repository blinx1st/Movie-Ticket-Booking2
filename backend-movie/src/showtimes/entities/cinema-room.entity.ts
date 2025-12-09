import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CinemaRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  cinemaId?: number;

  @Column({ default: '2D' })
  type: string;

  @Column({ type: 'int', default: 0 })
  capacity: number;
}
