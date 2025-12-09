import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Ticket } from '../../seats/entities/ticket.entity';
import { User } from 'src/users/schema/user.schema';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  bookingDate: Date;

  @Column({ default: 'Paid' })
  status: string; // Paid | Pending | Cancelled | Refunded

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  paymentRef?: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  userId?: string;

  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  movieId?: number;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column({ nullable: true })
  showtimeId?: number;

  @Column({ nullable: true })
  cinemaId?: number;

  @Column({ nullable: true })
  source?: string; // booking | manual

  @Column({ nullable: true })
  note?: string;

  @OneToMany(() => Ticket, (ticket) => ticket.booking, { cascade: true })
  tickets: Ticket[];
}
