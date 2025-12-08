import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiProperty } from '@nestjs/swagger';
import { BookSeatDto } from './dto/book-seat.dto';

@ApiTags('Seats Management')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) { }

  @Get('status')
  @ApiOperation({ summary: 'Xem sơ đồ ghế theo suất chiếu' })
  @ApiQuery({ name: 'showtimeId', type: Number, example: 101 })
  getSeatsStatus(@Query('showtimeId') showtimeId: string) {
    return this.seatsService.getSeatsStatus(+showtimeId);
  }

  @Post('book')
  @ApiOperation({ summary: 'Đặt ghế (Book vé - Tính tiền theo Phim)' })
  @ApiBody({ type: BookSeatDto })
  bookSeats(@Body() body: BookSeatDto) {

    return this.seatsService.bookSeats(
      body.userId,
      body.showtimeId,
      body.movieId,
      body.seatIds
    );
  }
}