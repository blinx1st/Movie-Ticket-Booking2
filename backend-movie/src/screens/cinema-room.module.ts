import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CinemaRoom } from '../showtimes/entities/cinema-room.entity';
import { CinemaRoomsController } from './cinema-room.controller';
import { CinemaRoomsService } from './cinema-room.service';

@Module({
  imports: [TypeOrmModule.forFeature([CinemaRoom])],
  controllers: [CinemaRoomsController],
  providers: [CinemaRoomsService],
  exports: [CinemaRoomsService],
})
export class CinemaRoomsModule { }
