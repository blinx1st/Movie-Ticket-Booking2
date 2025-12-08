import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { Ticket } from './entities/ticket.entity';
import { Booking } from '../revenue/entities/booking.entity';
import { Movie } from '../movies/entities/movie.entity'; // <-- 1. Import Movie
import { Showtime } from '../showtimes/entities/showtime.entity'; 
import { CinemaRoom } from '../showtimes/entities/cinema-room.entity'; // <-- Import


@Module({
  imports: [
    // 2. Đăng ký đủ 4 Entity: Seat, Ticket, Booking, VÀ Movie
    TypeOrmModule.forFeature([Seat, Ticket, Booking, Movie, Showtime]), 
  ],
  controllers: [SeatsController],
  providers: [SeatsService],
})
export class SeatsModule {}