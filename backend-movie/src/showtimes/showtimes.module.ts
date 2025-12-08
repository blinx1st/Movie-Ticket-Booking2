import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { CinemaRoom } from './entities/cinema-room.entity'; // <-- Import

@Module({
  imports: [
    // Đăng ký cả 2 entity thuộc quyền quản lý của module này
    TypeOrmModule.forFeature([Showtime, CinemaRoom]), 
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [TypeOrmModule] // Cho phép module khác dùng ké nếu cần
})
export class ShowtimesModule {}