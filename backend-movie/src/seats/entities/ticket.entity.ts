import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Seat } from './seat.entity';
import { Booking } from '../../revenue/entities/booking.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity'; 

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showtimeId: number; // Cột số nguyên lưu trong DB

  // 👇 2. QUAN TRỌNG: Phải có đoạn này để map sang Object Showtime
  @ManyToOne(() => Showtime)
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime; 

  @ManyToOne(() => Seat)
  @JoinColumn({ name: 'seatId' })
  seat: Seat;

  @ManyToOne(() => Booking, (booking) => booking.tickets)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
}