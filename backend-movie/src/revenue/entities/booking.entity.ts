import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { Movie } from '../../movies/entities/movie.entity';
import { Ticket } from '../../seats/entities/ticket.entity'; // <-- Import Ticket
import { User } from 'src/users/schema/user.schema';

@Entity()
export class Booking {
  // ... (giữ nguyên các cột cũ)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  bookingDate: Date;

  @Column({ default: 'Pending' })
  status: string;

  @Column({ nullable: true })
  userId: number;

  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Movie)
  movie: Movie;

  // --- THÊM PHẦN NÀY ---
  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];
}