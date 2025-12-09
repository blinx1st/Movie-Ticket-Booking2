import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';
import { BookSeatDto } from './dto/book-seat.dto';
import { CreateSeatDto } from './dto/create-seat.dto';
import { SeedSeatDto } from './dto/seed-seat.dto';
import { SeatsService } from './seats.service';

@ApiTags('Seats Management')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('status')
  @Public()
  @ApiOperation({ summary: 'Xem trạng thái ghế theo suất chiếu' })
  @ApiQuery({ name: 'showtimeId', type: Number, example: 101 })
  getSeatsStatus(@Query('showtimeId') showtimeId: string) {
    return this.seatsService.getSeatsStatus(+showtimeId);
  }

  @Post('book')
  @Public()
  @ApiOperation({ summary: 'Đặt ghế (book và tính tiền theo phim)' })
  @ApiBody({ type: BookSeatDto })
  bookSeats(@Body() body: BookSeatDto) {
    return this.seatsService.bookSeats(
      body.userId,
      body.showtimeId,
      body.movieId,
      body.seatIds,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách ghế theo roomId' })
  getByRoom(@Query('roomId') roomId: string) {
    return this.seatsService.listSeatsByRoom(+roomId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo ghế đơn lẻ' })
  createSeat(@Body() body: CreateSeatDto) {
    return this.seatsService.createSeat({
      row: body.row,
      number: body.number,
      type: body.type,
      roomId: body.roomId,
    });
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed layout ghế cho phòng, rows dạng A:8,B:8' })
  seedSeats(@Body() body: SeedSeatDto) {
    return this.seatsService.seedSeats(body.roomId, body.rows);
  }

  @Delete('by-room')
  @ApiOperation({ summary: 'Xóa toàn bộ seat của room' })
  deleteByRoom(@Query('roomId') roomId: string) {
    return this.seatsService.deleteSeatsByRoom(+roomId);
  }
}
